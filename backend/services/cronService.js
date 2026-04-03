const cron = require("node-cron");
const Job = require("../models/Job");
const User = require("../models/User");
const Message = require("../models/Message");
const cleanupUploads = require("../cleanupUploadsCron");

// Function to close expired jobs
const closeExpiredJobs = async () => {
  try {
    const now = new Date();

    // Find jobs where deadline has passed and isClosed is still false
    const expiredJobs = await Job.find({
      application_deadline_date: { $lt: now },
      isClosed: false,
    });

    if (expiredJobs.length > 0) {
      // Update all expired jobs to closed
      await Job.updateMany(
        { _id: { $in: expiredJobs.map((job) => job._id) } },
        { $set: { isClosed: true } },
      );

      console.log(`Closed ${expiredJobs.length} expired jobs`);
    }
  } catch (error) {
    console.error("Error closing expired jobs:", error);
  }
};

// Function to send job closure notification to employer
const sendJobClosureNotification = async (job, closureTime) => {
  try {
    // Find admin user
    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
      console.warn("No admin user found for sending job closure notification");
      return;
    }

    const postedDateString = job.createdAt.toLocaleString("en-US", {
      timeZone: "Asia/Kathmandu",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    // Create notification message
    const messageContent = `⚠️Warning, Your job posting <strong>"${job.title}"</strong> with id <strong>"${job._id}"</strong> posted on <strong>${postedDateString}</strong> has been automatically closed after being flagged by our system as a potential scam. This action was taken on <strong>${closureTime}</strong> as part of our platform's security measures to protect users. If you believe this was done in error, please contact us for further review.<br/><a style="color: blue; text-decoration: underline;" href="${process.env.FRONTEND_URL}/job/${job._id}">Click here to view that job</a>`;

    await Message.create({
      application: null,
      sender: admin._id,
      senderRole: "admin",
      recipient: job.company._id,
      content: messageContent,
      isAdminMessage: true,
    });

    console.log(
      `Notification sent to employer ${job.company._id} for job ${job._id}`,
    );
  } catch (error) {
    console.error("Error sending job closure notification:", error);
  }
};

// Function to close high fraud score jobs
const closeHighFraudJobs = async () => {
  try {
    // Find jobs where fraudScore > 0.6 and isClosed is still false
    const highFraudJobs = await Job.find({
      fraudScore: { $gt: 0.6 },
      isClosed: false,
    }).populate("company", "noOfWarnings isBanned");

    if (highFraudJobs.length > 0) {
      const closureTime = new Date();
      const closureTimeString = closureTime.toLocaleString("en-US", {
        timeZone: "Asia/Kathmandu",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      // Update all high fraud jobs to closed
      await Job.updateMany(
        { _id: { $in: highFraudJobs.map((job) => job._id) } },
        { $set: { isClosed: true } },
      );

      // Send notifications to employers
      for (const job of highFraudJobs) {
        await sendJobClosureNotification(job, closureTimeString);
      }

      // Collect unique company IDs to update
      const companyIds = [
        ...new Set(highFraudJobs.map((job) => job.company._id)),
      ];

      // Prepare bulk operations for updating users
      const bulkOps = companyIds.map((companyId) => {
        const company = highFraudJobs.find(
          (job) => job.company._id.toString() === companyId.toString(),
        ).company;
        const newWarningCount = (company.noOfWarnings || 0) + 1;
        const shouldBan = newWarningCount > 10;

        return {
          updateOne: {
            filter: { _id: companyId },
            update: {
              $inc: { noOfWarnings: 1 },
              $set: { isBanned: shouldBan },
            },
          },
        };
      });

      // Execute bulk update for users
      if (bulkOps.length > 0) {
        await User.bulkWrite(bulkOps);

        // Count how many users were banned
        const bannedUsersCount = bulkOps.filter(
          (op) => op.updateOne.update.$set.isBanned,
        ).length;

        console.log(
          `Closed ${highFraudJobs.length} high fraud jobs (fraudScore > 0.6)`,
        );
        console.log(
          `Updated ${companyIds.length} companies: ${bannedUsersCount} users banned due to excessive warnings`,
        );
      }
    } else {
      console.log("No high fraud jobs found to close");
    }
  } catch (error) {
    console.error("Error closing high fraud jobs:", error);
  }
};

// Function to check and expire premium subscriptions
const checkPremiumExpiration = async () => {
  try {
    const now = new Date();

    // Find users with premium subscriptions that expired 30+ days ago
    const expiredPremiumUsers = await User.find({
      isPremium: true,
      premiumIssueDate: { $exists: true, $ne: null },
      $expr: {
        $lt: [
          {
            $add: ["$premiumIssueDate", { $multiply: [30, 24, 60, 60, 1000] }],
          },
          now,
        ],
      },
    });

    if (expiredPremiumUsers.length > 0) {
      const userIds = expiredPremiumUsers.map((user) => user._id);

      // Update all expired premium users
      await User.updateMany(
        { _id: { $in: userIds } },
        {
          $set: {
            isPremium: false,
            premiumIssueDate: null,
            notificationCount: 0,
          },
        },
      );

      console.log(
        `Expired ${expiredPremiumUsers.length} premium subscriptions (30+ days since issue date) and reset notification counts`,
      );
    }
  } catch (error) {
    console.error("Error checking premium expiration:", error);
  }
};

// Cron expression: second minute hour day month dayOfWeek
// '0 0 18 * * *' means run at 6 PM every day
const startCronJobs = () => {
  // Close high fraud jobs at 6 PM
  cron.schedule("0 0 18 * * *", closeHighFraudJobs, {
    scheduled: true,
    timezone: "Asia/Kathmandu",
  });
  // Check premium expiration at 6:15 PM
  cron.schedule("0 15 18 * * *", checkPremiumExpiration, {
    scheduled: true,
    timezone: "Asia/Kathmandu",
  });
  // Close expired jobs at 12:01 AM
  cron.schedule("0 1 0 * * *", closeExpiredJobs, {
    scheduled: true,
    timezone: "Asia/Kathmandu",
  });
  // Schedule to run every 12:15 AM
  cron.schedule("0 15 0 * * *", cleanupUploads, {
    scheduled: true,
    timezone: "Asia/Kathmandu",
  });
};

module.exports = {
  startCronJobs,
  closeExpiredJobs,
  closeHighFraudJobs,
  checkPremiumExpiration,
};
