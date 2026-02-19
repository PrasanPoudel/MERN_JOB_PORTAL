require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "KaamsetuDB",
    });

    console.log("Connected to database");

    // Check if users already exist
    const existingJobSeeker = await User.findOne({ email: "jobseeker@kaamsetu.com" });
    const existingEmployer = await User.findOne({ email: "employer@kaamsetu.com" });

    if (existingJobSeeker && existingEmployer) {
      console.log("Test users already exist!");
      process.exit(0);
    }

    // Create Job Seeker
    if (!existingJobSeeker) {
      await User.create({
        name: "Job Seeker",
        email: "jobseeker@kaamsetu.com",
        password: "Password123",
        role: "jobSeeker",
        location: "Kathmandu, Nepal",
        skills: ["JavaScript", "React", "Node.js"],
      });
      console.log("✓ Job Seeker created");
    }

    // Create Employer
    if (!existingEmployer) {
      await User.create({
        name: "Employer User",
        email: "employer@kaamsetu.com",
        password: "Password123",
        role: "employer",
        companyName: "Kaamsetu Technologies",
        companyDescription: "Leading job portal in Nepal",
        companyLocation: "Kathmandu, Nepal",
      });
      console.log("✓ Employer created");
    }

    console.log("\nTest users created successfully!");
    console.log("\nJob Seeker Login:");
    console.log("Email: jobseeker@kaamsetu.com");
    console.log("Password: Password123");
    console.log("\nEmployer Login:");
    console.log("Email: employer@kaamsetu.com");
    console.log("Password: Password123");

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

seedUsers();
