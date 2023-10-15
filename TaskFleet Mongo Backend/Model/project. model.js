const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    projectLead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'  // Assuming you have a User model with the name 'User'
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    task: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }]
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
