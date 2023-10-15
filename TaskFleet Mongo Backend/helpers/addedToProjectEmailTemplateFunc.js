function generateEmailHTML(nameOfRecipient, nameOfProject, projectLeadName, startDate, endDate) {
    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
                border-radius: 10px;
            }
            .header {
                text-align: center;
                font-size: 24px;
                margin-bottom: 20px;
            }
            .content {
                margin-bottom: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                Welcome to ProjectHub!
            </div>
            <div class="content">
                Hello ${nameOfRecipient},
                <p>
                    You have been added to the project <strong>${nameOfProject}</strong> led by ${projectLeadName}.
                </p>
                <p>
                    Project Start Date: ${startDate}<br>
                    Project End Date: ${endDate}
                </p>
            </div>
            <div class="content">
                If you have any questions or need assistance, feel free to reach out.
            </div>
            <div class="content">
                Best regards,<br>
                ProjectHub Team
            </div>
        </div>
    </body>
    </html>
    `;
    return htmlTemplate;
}


module.exports = generateEmailHTML;