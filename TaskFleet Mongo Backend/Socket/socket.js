const socketio = require('socket.io');

const Message = require('../Model/message.model');

function setupSocket(server) {
    console.log("Socket is running")
    const io = socketio(server);

    io.on('connection', (socket) => {
        console.log('A user connected');
        socket.on("test", (data) => {
            io.emit("yoyo", data)
        })
        // Listen for a 'join room' event from the client
        socket.on('join room', async (data) => {
            console.log("THIS IS THE PROJECTID", data.projectId)
            socket.join(data.projectId);
            console.log(`User ${data.userId} joined room ${data.projectId}`);
            const messages = await Message.find({ projectId: data.projectId }).populate("userId")
            io.to(data.projectId).emit('chat messages', { messages });
        });

        // Listen for a 'chat message' event from the client
        socket.on('chat message', async (data) => {
            console.log("THIS IS THE PROJECTID", data.projectId)
            // console.log(`Received message from user ${data.userId} in room ${data.projectId}: ${data.message}`);
            // Save the message to the database
            const message = new Message({
                userId: data.userId,
                projectId: data.projectId,
                message: data.message,
                createdAt: new Date(),
            });
            await message.save()

            // Broadcast the messages to all clients in the same room
            const messages = await Message.find({ projectId: data.projectId }).populate("userId")
            io.to(data.projectId).emit('chat messages', { messages });
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });

    return io;
}

module.exports = setupSocket;
