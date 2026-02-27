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
      
      console.log(`Closed ${expiredJobs.length} expired jobs`);
    }
  } catch (error) {
    console.error("Error closing expired jobs:", error);
  }
};

// Function to close high fraud score jobs
const closeHighFraudJobs = async () => {
  try {
    // Find jobs where fraudScore > 0.4 and isClosed is still false
    const highFraudJobs = await Job.find({
      fraudScore: { $gt: 0.4 },
      isClosed: false,
    });

    if (highFraudJobs.length > 0) {
      // Update all high fraud jobs to closed
      await Job.updateMany(
        { _id: { $in: highFraudJobs.map((job) => job._id) } },
        { $set: { isClosed: true } },
      );
      
      console.log(`Closed ${highFraudJobs.length} high fraud jobs (fraudScore > 0.4)`);
    } else {
      console.log("No high fraud jobs found to close");
    }
  } catch (error) {
    console.error("Error closing high fraud jobs:", error);
  }
};

// Cron expression: minute hour day month dayOfWeek
// '0 0 18 * * *' means run at 6 PM every day
const startCronJobs = () => {
  // Close high fraud jobs at 4 PM
  cron.schedule("0 0 16 * * *", closeHighFraudJobs, {
    scheduled: true,
    timezone: "Asia/Kathmandu",
  });
  // Close expired jobs at 6 PM
  cron.schedule("0 0 18 * * *", closeExpiredJobs, {
    scheduled: true,
    timezone: "Asia/Kathmandu",
  });


  // console.log("Running at 4pm daily to automatically close jobs with high fraud probability (fraudScore > 0.4).");
  // console.log("Running at 6 PM daily to automatically close job after reaching deadline date.");
};

module.exports = {
  startCronJobs,
  closeExpiredJobs,
  closeHighFraudJobs,
};
