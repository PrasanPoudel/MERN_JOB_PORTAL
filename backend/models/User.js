const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["jobSeeker", "employer", "admin"],
      required: true,
    },
    avatar: String,
    resume: String,
    location: String,
    facebookLink: String,
    instagramLink: String,
    isPremium: {
      type: Boolean,
      default: false,
    },
    premiumIssueDate: { type: Date, default: null },
    isBanned: { type: Boolean, default: false },
    banReason: { type: String, default: "" },
    banDate: { type: Date },
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
    isCompanyVerified: {
      type: Boolean,
      default: false,
    },
    companyRegistrationNumber: {
      type: String,
    },
    panNumber: {
      type: String,
    },
    no_of_warnings: { type: Number, default: 0 },
  },
  { timestamps: true },
);

//Encrypt password before save
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// Match entered password
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
