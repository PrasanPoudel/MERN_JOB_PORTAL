const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  requireTLS: true,
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

const getStatusEmailTemplate = (
  userName,
  applicationId,
  newStatus,
  jobTitle,
) => {
  const statusMessages = {
    pending: "Your application is currently under review.",
    reviewed: "Your application has been reviewed by the employer.",
    shortlisted:
      "Congratulations! You have been shortlisted for the next round.",
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

exports.sendStatusChangeEmail = async (
  userEmail,
  userName,
  applicationId,
  newStatus,
  jobTitle,
) => {
  try {
    const mailOptions = {
      from: `"Kaamsetu" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Application Status Update - ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
      html: getStatusEmailTemplate(
        userName,
        applicationId,
        newStatus,
        jobTitle,
      ),
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

// Job recommendation email template
const getJobRecommendationEmailTemplate = (userName, job, similarityScore) => {
  const similarityPercentage = Math.round(similarityScore * 100);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .job-card { background: white; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
        .similarity-badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-weight: bold; color: white; background: #3b82f6; margin-bottom: 15px; }
        .job-title { font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 10px; }
        .company-name { font-size: 18px; color: #6b7280; margin-bottom: 20px; }
        .job-details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
        .detail-item { background: #f3f4f6; padding: 10px; border-radius: 6px; }
        .detail-label { font-size: 12px; color: #6b7280; text-transform: uppercase; }
        .detail-value { font-size: 14px; font-weight: bold; color: #1f2937; }
        .apply-button { display: inline-block; background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        .note { font-size: 12px; color: #6b7280; margin-top: 20px; font-style: italic; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Job Match Found!</h1>
          <p>We found a job that matches your profile</p>
        </div>
        <div class="content">
          <p>Dear <strong>${userName}</strong>,</p>
          <p>Based on your profile and preferences, we've found a job opportunity that's highly relevant to you:</p>
          
          <div class="job-card">
            <div class="similarity-badge">Match Score: ${similarityPercentage}%</div>
            <div class="job-title">${job.title}</div>
            <div class="company-name">${job.company?.companyName || job.company?.name || "Unknown Company"}</div>
            
            <div class="job-details">
              <div class="detail-item">
                <div class="detail-label">Location</div>
                <div class="detail-value">${job.location || "Not specified"}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Type</div>
                <div class="detail-value">${job.type}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Category</div>
                <div class="detail-value">${job.category || "Not specified"}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Experience</div>
                <div class="detail-value">${job.experienceLevel}</div>
              </div>
            </div>

            ${
              job.salaryMin && job.salaryMax
                ? `
            <div class="detail-item" style="grid-column: 1 / -1; background: #ecfdf5;">
              <div class="detail-label">Salary Range</div>
              <div class="detail-value">NPR ${job.salaryMin.toLocaleString()} - NPR ${job.salaryMax.toLocaleString()}</div>
            </div>
            `
                : ""
            }

            <p style="margin-top: 20px;"><strong>Why this match?</strong> Our algorithm analyzed your skills, experience, and preferences to find jobs that align with your career goals.</p>
            
            <a href="${process.env.FRONTEND_URL}/job/${job._id}" class="apply-button">View Job Details & Apply</a>
          </div>
          
          <p>This recommendation was generated automatically based on your profile. If you find this job interesting, we encourage you to apply!</p>
          
          <p>Best regards,<br><strong>Kaamsetu Team</strong></p>
          
          <div class="note">
            Note: You will receive a maximum of 24 job recommendations per month as part of your premium membership benefits.
          </div>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send job recommendation email
exports.sendJobRecommendationEmail = async (user, job, similarityScore) => {
  try {
    const mailOptions = {
      from: `"Kaamsetu" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `New Job Match: ${job.title} - ${Math.round(similarityScore * 100)}% Match`,
      html: getJobRecommendationEmailTemplate(user.name, job, similarityScore),
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Job recommendation email sending failed:", error);
    return { success: false, error: error.message };
  }
};

// Export utility functions
exports.generateOTP = generateOTP;
exports.generateToken = generateToken;
