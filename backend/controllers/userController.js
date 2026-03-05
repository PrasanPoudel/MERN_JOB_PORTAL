const fs = require("fs");
const path = require("path");
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");

exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      avatar,
      resume,
      skills,
      experience,
      certifications,
      education,
      location,
      facebookLink,
      instagramLink,
      companyName,
      companyDescription,
      companyLogo,
      companyLocation,
      companyWebsiteLink,
      companySize,
      companyRegistrationNumber,
      panNumber,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.name = name ?? user.name;
    user.avatar = avatar ?? user.avatar;
    user.resume = resume ?? user.resume;
    user.location = location ?? user.location;
    user.facebookLink = facebookLink ?? user.facebookLink;
    user.instagramLink = instagramLink ?? user.instagramLink;

    if (user.role === "jobSeeker") {
      user.skills = skills ?? user.skills;
      user.experience = experience ?? user.experience;
      user.certifications = certifications ?? user.certifications;
      user.education = education ?? user.education;
    }

    if (user.role === "employer") {
      user.companyName = companyName ?? user.companyName;
      user.companyDescription = companyDescription ?? user.companyDescription;
      user.companyLogo = companyLogo ?? user.companyLogo;
      user.companyLocation = companyLocation ?? user.companyLocation;
      user.companyWebsiteLink = companyWebsiteLink ?? user.companyWebsiteLink;
      user.companySize = companySize ?? user.companySize;
      user.companyRegistrationNumber =
        companyRegistrationNumber ?? user.companyRegistrationNumber;
      user.panNumber = panNumber ?? user.panNumber;
    }

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || "",
      location: user.location || "",
      facebookLink: user.facebookLink || "",
      instagramLink: user.instagramLink || "",
      resume: user.resume || "",
      skills: user.skills || [],
      education: user.education || [],
      experience: user.experience || [],
      certifications: user.certifications || [],
      isPremium: user.isPremium || false,
      premiumIssueDate: user.premiumIssueDate || null,
      companyName: user.companyName || "",
      companyDescription: user.companyDescription || "",
      companyLogo: user.companyLogo || "",
      companyLocation: user.companyLocation || "",
      companyWebsiteLink: user.companyWebsiteLink || "",
      companySize: user.companySize || "",
      isCompanyVerified: user.isCompanyVerified || false,
      companyRegistrationNumber: user.companyRegistrationNumber || "",
      panNumber: user.panNumber || "",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//delete resume (jobSeeker only)
exports.deleteResume = async (req, res) => {
  try {
    const { resumeUrl } = req.body; //expect resumeUrl to be the url of the resume
    const fileName = resumeUrl?.split(" ")?.pop(); //extract file name from url

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "jobSeeker") {
      return res
        .status(403)
        .json({ message: "Only jobSeekers can delete resume" });
    }

    const filePath = path.join(__dirname, "../uploads", fileName);

    //check if the file exists then only delete the file if found
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); //delete
    }
    user.resume = "";
    await user.save();
    res.json({ message: "Resume deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete user and all related activities
exports.deleteUser = async (req, res) => {
  try {
    const { email } = req.params;

    // Verify the authenticated user is deleting their own account
    if (req.user.email !== email) {
      return res.status(403).json({
        message: "You can only delete your own account",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete user's files (avatar, resume, company logo)
    if (fs.existsSync(user.avatar)) {
      fs.unlinkSync(user.avatar); //delete
    }
    if (fs.existsSync(user.companyLogo)) {
      fs.unlinkSync(user.companyLogo); //delete
    }
    if (fs.existsSync(user.resume)) {
      fs.unlinkSync(user.resume); //delete
    }

    // If user is an employer
    if (user.role === "employer") {
      // Get all jobs posted by this employer
      const jobs = await Job.find({ company: user._id });
      const jobIds = jobs.map((job) => job._id);

      // Delete all applications for these jobs
      await Application.deleteMany({ job: { $in: jobIds } });

      // Delete all jobs posted by this employer
      await Job.deleteMany({ company: user._id });
    }

    // If user is a job seeker
    if (user.role === "jobSeeker") {
      // Delete all job applications by this user
      await Application.deleteMany({ applicant: user._id });

      // Delete all saved jobs by this user
      await SavedJob.deleteMany({ jobSeeker: user._id });
    }

    // Delete the user
    await User.findByIdAndDelete(user._id);

    res.json({
      message:
        "User account and all associated activities deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Change user password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Validate inputs
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Old password and new password are required" });
    }

    // Get user from authenticated request
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify old password
    const isPasswordCorrect = await user.matchPassword(oldPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Check if new password is same as old password
    if (oldPassword === newPassword) {
      return res.status(400).json({
        message: "New password must be different from current password",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
