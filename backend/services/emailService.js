const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const getStatusEmailTemplate = (userName, applicationId, newStatus, jobTitle) => {
  const statusMessages = {
    pending: "Your application is currently under review.",
    reviewed: "Your application has been reviewed by the employer.",
    shortlisted: "Congratulations! You have been shortlisted for the next round.",
    interview: "Great news! You have been selected for an interview.",
    rejected: "Unfortunately, your application was not selected this time.",
    hired: "Congratulations! You have been hired for this position.",
  };

  const statusColors = {
    pending: "#f59e0b",
    reviewed: "#3b82f6",
    shortlisted: "#8b5cf6",
    interview: "#06b6d4",
    rejected: "#ef4444",
    hired: "#10b981",
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; color: white; background: ${statusColors[newStatus] || "#6b7280"}; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Application Status Update</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${userName}</strong>,</p>
          <p>We have an update regarding your job application.</p>
          
          <div class="info-box">
            <p><strong>Job Title:</strong> ${jobTitle}</p>
            <p><strong>Application ID:</strong> ${applicationId}</p>
            <p><strong>New Status:</strong> <span class="status-badge">${newStatus.toUpperCase()}</span></p>
          </div>
          
          <p>${statusMessages[newStatus] || "Your application status has been updated."}</p>
          
          <p>You can view your application details by logging into your account.</p>
          
          <p>Best regards,<br><strong>Job Portal Team</strong></p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

exports.sendStatusChangeEmail = async (userEmail, userName, applicationId, newStatus, jobTitle) => {
  try {
    const mailOptions = {
      from: `"Job Portal" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Application Status Update - ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
      html: getStatusEmailTemplate(userName, applicationId, newStatus, jobTitle),
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};
