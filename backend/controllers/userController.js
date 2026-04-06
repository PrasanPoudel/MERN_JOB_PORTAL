const cloudinary = require("../config/cloudinary");
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");
const Message = require("../models/Message");

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
      companyPhoneNumber,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.name = name ?? user.name;

    // Handle avatar update - delete old file from Cloudinary if replaced
    if (avatar && avatar !== user.avatar && user.avatarPublicId) {
      try {
        await cloudinary.uploader.destroy(user.avatarPublicId);
      } catch (e) {
        console.error("Failed to delete old avatar from Cloudinary:", e);
      }
    }
    if (avatar && avatar !== user.avatar) {
      // Extract new public ID from Cloudinary URL
      const avatarPublicIdMatch = avatar.match(/\/v\d+\/(.+?)\./);
      if (avatarPublicIdMatch) {
        user.avatarPublicId = avatarPublicIdMatch[1];
      }
    }
    user.avatar = avatar ?? user.avatar;

    // Handle resume update - delete old file from Cloudinary if replaced
    if (resume && resume !== user.resume && user.resumePublicId) {
      try {
        await cloudinary.uploader.destroy(user.resumePublicId);
      } catch (e) {
        console.error("Failed to delete old resume from Cloudinary:", e);
      }
    }
    if (resume && resume !== user.resume) {
      // Extract new public ID from Cloudinary URL
      const resumePublicIdMatch = resume.match(/\/v\d+\/(.+?)\./);
      if (resumePublicIdMatch) {
        user.resumePublicId = resumePublicIdMatch[1];
      }
    }
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

      // Handle company logo update - delete old file from Cloudinary if replaced
      if (
        companyLogo &&
        companyLogo !== user.companyLogo &&
        user.companyLogoPublicId
      ) {
        try {
          await cloudinary.uploader.destroy(user.companyLogoPublicId);
        } catch (e) {
          console.error(
            "Failed to delete old company logo from Cloudinary:",
            e,
          );
        }
      }
      if (companyLogo && companyLogo !== user.companyLogo) {
        // Extract new public ID from Cloudinary URL
        const companyLogoPublicIdMatch = companyLogo.match(/\/v\d+\/(.+?)\./);
        if (companyLogoPublicIdMatch) {
          user.companyLogoPublicId = companyLogoPublicIdMatch[1];
        }
      }
      user.companyLogo = companyLogo ?? user.companyLogo;
      user.companyLocation = companyLocation ?? user.companyLocation;
      user.companyPhoneNumber = companyPhoneNumber ?? user.companyPhoneNumber;
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
      companyPhoneNumber: user.companyPhoneNumber || "",
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

// Delete resume (jobSeeker only)
exports.deleteResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "jobSeeker") {
      return res
        .status(403)
        .json({ message: "Only jobSeekers can delete resume" });
    }

    if (user.resumePublicId) {
      await cloudinary.uploader.destroy(user.resumePublicId);
    }

    user.resume = "";
    user.resumePublicId = "";
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

    // Delete user's files from Cloudinary
    try {
      if (user.avatarPublicId) {
        await cloudinary.uploader.destroy(user.avatarPublicId);
      }
      if (user.resumePublicId) {
        await cloudinary.uploader.destroy(user.resumePublicId);
      }
      if (user.companyLogoPublicId) {
        await cloudinary.uploader.destroy(user.companyLogoPublicId);
      }
    } catch (fileError) {
      console.error("Error deleting user files from Cloudinary:", fileError);
      // Continue with deletion even if file deletion fails
    }

    // Delete all messages sent or received by this user
    await Message.deleteMany({
      $or: [{ sender: user._id }, { receiver: user._id }],
    });

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

    // Remove premium status and clear premium-related data
    user.isPremium = false;
    user.premiumIssueDate = null;

    // Delete the user
    await User.findByIdAndDelete(user._id);

    res.json({
      message: "User account and all associated data deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Failed to delete user account" });
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
