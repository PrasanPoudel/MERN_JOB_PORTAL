const Notification = require("../models/Notification");
const User = require("../models/User");
const Job = require("../models/Job");
const { sendStatusChangeEmail } = require("../services/emailService");


exports.sendJobRecommendations = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    const job = await Job.findById(jobId).populate("company", "name companyName");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const jobSeekers = await User.find({
      role: "jobSeeker",
      skills: { $in: job.requiredSkills || [] },
    }).select("name email skills");

    if (jobSeekers.length === 0) {
      return res.status(200).json({ 
        message: "No matching job seekers found",
        sent: 0 
      });
    }

    let sentCount = 0;
    const errors = [];

    for (const jobSeeker of jobSeekers) {
      try {
 
        await sendJobRecommendationEmail(
          jobSeeker.email,
          jobSeeker.name,
          job.title,
          job.company.companyName || job.company.name,
          job._id
        );


        await Notification.create({
          to: jobSeeker.email,
          subject: `Job Recommendation: ${job.title}`,
          body: `New job opportunity matching your skills`,
          status: "sent",
        });

        sentCount++;
      } catch (error) {
        errors.push({ email: jobSeeker.email, error: error.message });
      }
    }

    res.status(200).json({
      message: `Job recommendations sent successfully`,
      sent: sentCount,
      total: jobSeekers.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getNotificationLogs = async (req, res) => {
  try {
    const { limit = 50, status } = req.query;

    const query = status ? { status } : {};
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      total: notifications.length,
      notifications,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const sendJobRecommendationEmail = async (email, userName, jobTitle, companyName, jobId) => {
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

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .job-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9; }
        .btn { display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 New Job Recommendation</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${userName}</strong>,</p>
          <p>We found a job opportunity that matches your skills and profile!</p>
          
          <div class="job-card">
            <h2 style="color: #0ea5e9; margin-top: 0;">${jobTitle}</h2>
            <p><strong>Company:</strong> ${companyName}</p>
            <p>This position matches your skills and experience. We think you'd be a great fit!</p>
            <a href="${process.env.FRONTEND_URL}/job/${jobId}" class="btn">View Job Details</a>
          </div>
          
          <p>Don't miss this opportunity! Apply now before it's too late.</p>
          
          <p>Best regards,<br><strong>Job Portal Team</strong></p>
        </div>
        <div class="footer">
          <p>This is an automated recommendation based on your profile.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Job Portal" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Job Recommendation: ${jobTitle} at ${companyName}`,
    html: htmlTemplate,
  });
};
