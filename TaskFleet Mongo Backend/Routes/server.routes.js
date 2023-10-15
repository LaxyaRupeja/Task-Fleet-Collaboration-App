const express = require('express');
const User = require('../Model/user.model');
const Router = express.Router()
const jwt = require('jsonwebtoken');
const multer = require('multer');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const authenticateJWT = require('../Middlware/authMiddlware');
const Project = require('../Model/project. model');
const Task = require('../Model/task.model');
const serviceAccount = require('../auction-app-dcd79-firebase-adminsdk-cf6d6-93c69eac03.json');
const sendNotificationAndEmail = require('../helpers/sendNotification');
const generateEmailHTML = require('../helpers/addedToProjectEmailTemplateFunc');
const Notification = require('../Model/notification.model');
const generateEmailTemplate = require('../helpers/taskAssignedEmailTemplateFunc');
const generateRemovalEmailHTML = require('../helpers/removeFromTheProjectEmailFunc');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const bucket = admin.storage().bucket('gs://auction-app-dcd79.appspot.com');
Router.get("/", (req, res) => {
    res.send("Welcone to Backend")
})
Router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);  // Hash the password

        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

Router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id }, "JWT_SECRET", { expiresIn: '7d' });
        res.json({ token, user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


Router.post('/projects', authenticateJWT, async (req, res) => {
    try {
        const { projectName, description, startDate, endDate } = req.body;
        const projectLead = req.user.userId;

        const project = new Project({
            projectName,
            description,
            startDate,
            endDate,
            projectLead
        });

        await project.save();

        res.status(201).json({ message: 'Project created successfully', project });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


Router.get('/projects/me', authenticateJWT, async (req, res) => {
    try {
        const projects = await Project.find({ projectLead: req.user.userId });
        res.json({ projects });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

Router.get('/projects/all', authenticateJWT, async (req, res) => {
    try {
        const projects = await Project.find().populate("projectLead").populate("members").populate("task");
        res.json({ projects });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
Router.patch('/projects/:projectId', authenticateJWT, async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const { projectName, description, startDate, endDate } = req.body;

        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { projectName, description, startDate, endDate },
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json({ message: 'Project updated successfully', project: updatedProject });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

Router.delete('/projects/:projectId', authenticateJWT, async (req, res) => {
    try {
        const projectId = req.params.projectId;

        const deletedProject = await Project.findByIdAndDelete(projectId);

        if (!deletedProject) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json({ message: 'Project deleted successfully', project: deletedProject });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

Router.post('/projects/:projectId/add/:username', authenticateJWT, async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const username = decodeURIComponent(req.params.username);
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const project = await Project.findById(projectId).populate("projectLead");;

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        const emailForUser = generateEmailHTML(user.username, project.projectName, project.projectLead.username, project.startDate, project.endDate)
        sendNotificationAndEmail(user._id, `Welcome to ${project.projectName} Team`, `You've been added to our project "${project.projectName}" Your involvement and expertise will greatly contribute to its success. Let's do this!`, emailForUser)
        project.members.push(user._id);
        await project.save();

        res.json({ message: 'User added to project successfully', project });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// remove user
Router.post('/projects/:projectId/remove/:username', authenticateJWT, async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const username = decodeURIComponent(req.params.username);

        // Find the user by username to get their ID
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the project by ID
        const project = await Project.findById(projectId).populate('projectLead');

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Remove the user's ID from the project's members
        const userIndex = project.members.indexOf(user._id);
        if (userIndex !== -1) {
            project.members.splice(userIndex, 1);
        }
        sendNotificationAndEmail(user._id, `Removal from Project ${project.projectName} on ProjectHub`, `"Dear ${user.username}, you have been successfully removed from the project '${project.projectName}'."`, generateRemovalEmailHTML(user.username, project.projectName, project.projectLead.username, new Date(),))
        await project.save();

        res.json({ message: 'User removed from project successfully', project });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


Router.post('/task/:projectId/:username', authenticateJWT, async (req, res) => {
    try {
        const { taskName, description, deadline, priority, status } = req.body;
        const projectId = req.params.projectId;
        const username = decodeURIComponent(req.params.username);

        // Find the user by username to get their ID
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }


        const task = new Task({
            taskName,
            description,
            deadline,
            priority,
            status,
            assignedTo: user._id
        });

        // Save the task
        await task.save();

        // Find the project by ID
        const project = await Project.findById(projectId)

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        sendNotificationAndEmail(user._id, `New Task Assigned: ${task.taskName} in ${project.projectName}`, `Hello ${user.username}, a new task has been assigned to you: ${task.taskName} in ${project.projectName} with a deadline of ${task.deadline}. Please review and take necessary actions. - Your Team`, generateEmailTemplate(user.username, task.taskName, project.projectName, task.deadline, task.priority)
        )

        project.task.push(task._id);
        await project.save();

        res.json({ message: 'Task created successfully', task });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// delete task

Router.delete('/task/:projectId/:taskId', authenticateJWT, async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const taskId = req.params.taskId;

        // Find the project by ID
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Check if the task exists in the project's tasks
        const taskIndex = project.task.indexOf(taskId);
        if (taskIndex === -1) {
            return res.status(404).json({ error: 'Task not found in the project' });
        }

        // Remove the task from the project's tasks
        project.task.splice(taskIndex, 1);
        await project.save();

        // Remove the task from the Task collection
        await Task.findByIdAndRemove(taskId);

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

Router.get("/projects/tasks/:projectId", authenticateJWT, async (req, res) => {
    try {

        const project = await Project.findById(req.params.projectId).populate("task").populate("members").populate("projectLead");
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        await Task.populate(project.task, { path: 'assignedTo' });
        res.json({ project })

    } catch (error) {
        res.status(400).json({ error: error.message });

    }
})

Router.get('/users', async (req, res) => {
    const { username } = req.query;

    try {
        // Create a case-insensitive regex pattern for the provided username substring
        const regexPattern = new RegExp(username, 'i');

        const users = await User.find({ username: { $regex: regexPattern } });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

Router.put("/tasks/:taskId", async (req, res) => {
    const taskId = req.params.taskId;
    const { taskName, description, priority, status, deadline } = req.body;
    try {

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { taskName, description, priority, status, deadline },
            { new: true }
        );
        if (!updatedTask) {
            res.status(404).json({ error: "Task not found" })
        }
        res.json({ updatedTask })

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
})
Router.get("/tasks/:taskId", async (req, res) => {
    const taskId = req.params.taskId;
    try {
        const task = await Task.findById(taskId);
        res.json({ task });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

Router.get("/expire", authenticateJWT, (req, res) => {
    res.json({ isSuccess: true })
})

const upload = multer({
    storage: multer.memoryStorage(),
});
Router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        const fileName = `${Date.now()}-${file.originalname}`;
        const fileUpload = bucket.file(fileName);

        // Create a writable stream to upload the image
        const stream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });

        stream.on('error', (error) => {
            return res.status(500).send('Error uploading file: ' + error.message);
        });

        stream.on('finish', async () => {
            // Make the image publicly accessible
            await fileUpload.makePublic();

            const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
            res.json({ imageUrl });
        });

        // Pipe the image data into the writable stream
        stream.end(file.buffer);
    } catch (error) {
        res.status(500).send('Something went wrong: ' + error.message);
    }
});

Router.get("/notifications", authenticateJWT, async (req, res) => {
    const userId = req.user.userId;
    try {
        const notifications = await Notification.find({ recipient: userId })
        res.json({ notifications })
    } catch (error) {
        res.status(500).send('Something went wrong: ' + error.message);

    }

})
Router.get("/members/projects", authenticateJWT, async (req, res) => {
    const userId = req.user.userId;

    try {
        const projects = await Project.find({ members: userId });
        res.json({ projects });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
})

Router.get("/getUser", authenticateJWT, async (req, res) => {
    const userId = req.user.userId;
    try {
        const user = await User.findById(userId);
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
})


module.exports = Router