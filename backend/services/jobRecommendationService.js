const User = require("../models/User");
const Job = require("../models/Job");
const TFIDFSimilarity = require("../utils/tfidfSimilarity");
const { sendJobRecommendationEmail } = require("./emailService");

class JobRecommendationService {
  static async processJobRecommendations(jobId) {
    try {
      // Find the job
      const job = await Job.findById(jobId).populate("company");
      if (!job) {
        throw new Error("Job not found");
      }
      if (job.emailNotificationSent) {
        console.log(`Notifications already sent for job ${jobId}`);
        return { success: true, message: "Notifications already processed" };
      }

      console.log(`Processing recommendations for job: ${job.title} (${jobId})`);

      // Fetch all premium job seekers
      const premiumJobSeekers = await User.find({
        isPremium: true,
        role: "jobSeeker"
      });

      if (premiumJobSeekers.length === 0) {
        console.log("No premium job seekers found");
        // Mark job as processed even if no users found
        await Job.findByIdAndUpdate(jobId, { emailNotificationSent: true });
        return { success: true, message: "No premium job seekers found" };
      }

      // console.log(`Found ${premiumJobSeekers.length} premium job seekers`);

      let processedCount = 0;
      let notifiedCount = 0;
      let skippedCount = 0;

      // Process each premium job seeker
      for (const user of premiumJobSeekers) {
        processedCount++;

        // Check monthly notification limit (skip if already sent 24 notifications)
        if (user.notificationCount >= 24) {
          console.log(`Skipping user ${user._id} - monthly limit reached (${user.notificationCount}/24)`);
          skippedCount++;
          continue;
        }

        try {
          // Calculate similarity between job and user profile
          const similarityScore = TFIDFSimilarity.calculateSimilarity(user, job);
          
          console.log(`Similarity score for user ${user._id}: ${similarityScore}`);

          // Skip if similarity score is below threshold (0.5)
          if (similarityScore < 0.5) {
            console.log(`Skipping user ${user._id} - similarity score too low (${similarityScore})`);
            skippedCount++;
            continue;
          }

          // Send email notification
          const emailResult = await sendJobRecommendationEmail(user, job, similarityScore);

          if (emailResult.success) {
            // Increment notification count only for successful emails
            user.notificationCount += 1;
            await user.save();
            notifiedCount++;
            console.log(`Successfully notified user ${user._id} - count: ${user.notificationCount}`);
          } else {
            console.log(`Failed to send email to user ${user._id}`);
            // Do not increment counter for failed emails
          }

        } catch (error) {
          console.error(`Error processing user ${user._id}:`, error.message);
          // Continue with next user even if one fails
          continue;
        }
      }

      await Job.findByIdAndUpdate(jobId, { emailNotificationSent: true });

      const result = {
        success: true,
        jobId: jobId,
        jobTitle: job.title,
        totalUsers: premiumJobSeekers.length,
        processedUsers: processedCount,
        notifiedUsers: notifiedCount,
        skippedUsers: skippedCount,
        message: `Processed ${processedCount} users, notified ${notifiedUsers}, skipped ${skippedCount}`
      };

      console.log("Job recommendation processing completed:", result);
      return result;

    } catch (error) {
      console.error("Error in job recommendation processing:", error);
      throw error;
    }
  }
}

module.exports = JobRecommendationService;