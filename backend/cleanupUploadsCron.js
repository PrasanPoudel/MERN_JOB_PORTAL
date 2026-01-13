const fs = require("fs");
const path = require("path");
const cron = require("node-cron");
const mongoose = require("mongoose");

const User = require("./models/User");
const Application = require("./models/Application");

require("dotenv").config();
const UPLOADS_DIR = path.join(__dirname, "uploads");

// Connect to DB if not already connected
if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

async function getAllReferencedFiles() {
  // Get all user file references
  const users = await User.find({}, "avatar resume companyLogo").lean();
  const userFiles = [];
  users.forEach((u) => {
    if (u.avatar) userFiles.push(path.basename(u.avatar));
    if (u.resume) userFiles.push(path.basename(u.resume));
    if (u.companyLogo) userFiles.push(path.basename(u.companyLogo));
  });

  // Get all application resumes
  const applications = await Application.find({}, "resume").lean();
  const appFiles = [];
  applications.forEach((a) => {
    if (a.resume) appFiles.push(path.basename(a.resume));
  });

  return new Set([...userFiles, ...appFiles]);
}

async function cleanupUploads() {
  try {
    const referencedFiles = await getAllReferencedFiles();
    const files = fs.readdirSync(UPLOADS_DIR);
    for (const file of files) {
      if (!referencedFiles.has(file)) {
        // File is not referenced, delete it
        fs.unlinkSync(path.join(UPLOADS_DIR, file));
        // console.log(`[CLEANUP] Deleted unused file: ${file}`);
      }
    }
  } catch (err) {
    console.error("[CLEANUP] Error during uploads cleanup:", err);
  }
}

// Schedule to run every 30 minutes
cron.schedule("*/30 * * * *", () => {
  cleanupUploads();
});

// Run once on startup
cleanupUploads();
