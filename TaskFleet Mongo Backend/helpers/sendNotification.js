const Notification = require('../Model/notification.model'); // Replace with the correct path to your notification model
const nodemailer = require('nodemailer');
const User = require("../Model/user.model")
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "altlakshi@gmail.com",
        pass: "jzle plal lxvf pilt",
    },
});


const sendNotificationAndEmail = async (userId, title, message, emailTemplate) => {
    try {
        const notification = new Notification({
            title,
            recipient: userId,
            message,
        });

        await notification.save();
        console.log('Notification saved successfully.');

        // Retrieve user's email based on userId (you need to implement this part)
        const user = await User.findById(userId)
        const recipientEmail = user.email;


        // Send email notification
        const mailOptions = {
            from: 'altlakshi@gmail.com',
            to: recipientEmail,
            subject: title,
            html: emailTemplate,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email notification:', error);
            } else {
                console.log('Email notification sent:', info.response);
            }
        });
    } catch (error) {
        console.error('Error saving notification:', error);
    }
};

module.exports = sendNotificationAndEmail;
