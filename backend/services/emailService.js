const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Generate secure token
const generateToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

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
          
          <p>Best regards,<br><strong>Kaamsetu Team</strong></p>
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
      from: `"Kaamsetu" <${process.env.EMAIL_USER}>`,
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

// OTP verification email template
const getOTPEmailTemplate = (userName, otp) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-box { background: white; padding: 30px; border-radius: 8px; text-align: center; margin: 20px 0; border: 2px dashed #0ea5e9; }
        .otp-code { font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0284c7; margin: 20px 0; }
        .info-text { color: #6b7280; font-size: 14px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Verify Your Email</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${userName}</strong>,</p>
          <p>Thank you for signing up! To complete your registration, please verify your email address using the code below:</p>
          
          <div class="otp-box">
            <h3>Your Verification Code</h3>
            <div class="otp-code">${otp}</div>
            <p class="info-text">This code will expire in 10 minutes</p>
          </div>
          
          <p>If you didn't create an account with us, please ignore this email.</p>
          
          <p>Best regards,<br><strong>Kaamsetu Team</strong></p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Password reset email template
const getPasswordResetEmailTemplate = (userName, resetUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .reset-box { background: white; padding: 30px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
        .reset-button { display: inline-block; background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
        .info-text { color: #6b7280; font-size: 14px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${userName}</strong>,</p>
          <p>We received a request to reset your password. Click the button below to reset it:</p>
          
          <div class="reset-box">
            <a href="${resetUrl}" class="reset-button">Reset My Password</a>
            <p class="info-text">This link will expire in 15 minutes</p>
          </div>
          
          <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
          
          <p>Best regards,<br><strong>Kaamsetu Team</strong></p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send OTP email
exports.sendOTPEmail = async (userEmail, userName, otp) => {
  try {
    const mailOptions = {
      from: `"Kaamsetu" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Verify Your Email Address",
      html: getOTPEmailTemplate(userName, otp),
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("OTP email sending failed:", error);
    throw error;
  }
};

// Send password reset email
exports.sendPasswordResetEmail = async (userEmail, userName, resetUrl) => {
  try {
    const mailOptions = {
      from: `"Kaamsetu" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Reset Your Password",
      html: getPasswordResetEmailTemplate(userName, resetUrl),
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Password reset email sending failed:", error);
    throw error;
  }
};

// Export utility functions
exports.generateOTP = generateOTP;
exports.generateToken = generateToken;
