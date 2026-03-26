const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const tempMailSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["jobSeeker", "employer", "admin"],
      required: true,
    },
    emailVerificationToken: { type: String, required: true },
    emailVerificationExpires: { type: Date, required: true },
    lastOtpSentAt: { type: Date },
    avatar: String,
    location: String,
    facebookLink: String,
    instagramLink: String,
    skills: [String],
    education: [
      {
        study: String,
        institution: String,
        location: String,
        startDate: Date,
        endDate: Date,
      },
    ],
    experience: [
      {
        jobTitle: String,
        company: String,
        location: String,
        startDate: Date,
        endDate: { type: Date, default: null },
        isCurrent: Boolean,
        description: [String],
      },
    ],
    certifications: [
      {
        name: String,
        issuer: String,
        date: Date,
        link: String,
      },
    ],
    // For employer
    companyName: String,
    companyDescription: String,
    companyLogo: String,
    companyLocation: String,
    companyWebsiteLink: String,
    companySize: String,
    companyRegistrationNumber: String,
    panNumber: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("TempMail", tempMailSchema);