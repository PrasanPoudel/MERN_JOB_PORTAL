const cron = require("node-cron");
const Job = require("../models/Job");

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
    }
  } catch (error) {
    console.error("Error closing expired jobs:", error);
  }
};

// Schedule the cron job to run daily at midnight (12:00 AM)
// Cron expression: minute hour day month dayOfWeek
// '0 0 0 * * *' means run at 00:00:00 every day
const startCronJob = () => {
  cron.schedule("0 0 0 * * *", closeExpiredJobs, {
    scheduled: true,
    timezone: "Asia/Kathmandu",
  });

  console.log("Running Auto Job close after reaching deadline date.");
};

module.exports = {
  startCronJob,
  closeExpiredJobs,
};
