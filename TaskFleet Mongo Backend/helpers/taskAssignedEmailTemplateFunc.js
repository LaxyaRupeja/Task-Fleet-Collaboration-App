function generateEmailTemplate(recipientName, taskName, projectName, deadline, priority) {
    const emailTemplate = `
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f5f5f5;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        max-width: 500px;
                        margin: 0 auto;
                    }
                    .content {
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 10px;
                        margin-bottom: 20px;
                    }
                    h1 {
                        font-size: 24px;
                        margin: 0;
                    }
                    p {
                        font-size: 16px;
                        margin: 10px 0;
                    }
                    ul {
                        list-style-type: none;
                        padding: 0;
                    }
                </style>
            </head>
            <body>
                <div class="content">
                    <h1>New Task Assigned</h1>
                    <p>Hello ${recipientName},</p>
                    <p>A new task has been assigned to you:</p>
                    <ul>
                        <li><strong>Task Name:</strong> ${taskName}</li>
                        <li><strong>Project Name:</strong> ${projectName}</li>
                        <li><strong>Deadline:</strong> ${deadline}</li>
                        <li><strong>Priority:</strong> ${priority}</li>
                    </ul>
                    <p>Please review and take necessary actions.</p>
                </div>
                <div style="text-align: center; font-size: 14px;">
                    <p>This email was generated automatically. Please do not reply.</p>
                </div>
            </body>
        </html>
    `;
    return emailTemplate;
}
module.exports = generateEmailTemplate