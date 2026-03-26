const User = require("../models/User");
const TempMail = require("../models/TempMail");
const jwt = require("jsonwebtoken");
const {
  generateOTP,
  generateToken,
  sendOTPEmail,
  sendPasswordResetEmail,
} = require("../services/emailService");

const generateJwtToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "60d" });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, avatar, role } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Please provide required details for registration!" });
    }
    const user = await User.create({
      name,
      email,
      password,
      role,
      avatar,
    });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateJwtToken(user._id),
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
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    if (user && !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid password, Try again" });
    }

    // Check if user is banned
    if (user?.isBanned) {
      return res.status(403).json({
        message: "Your account has been banned",
        banReason: user.banReason,
        banDate: user.banDate,
      });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateJwtToken(user._id),
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

// Send OTP for email verification
exports.sendVerificationEmail = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      avatar,
      location,
      facebookLink,
      instagramLink,
      skills,
      education,
      experience,
      certifications,
      companyName,
      companyDescription,
      companyLogo,
      companyLocation,
      companyWebsiteLink,
      companySize,
      companyRegistrationNumber,
      panNumber,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check if temp user already exists
    let tempUser = await TempMail.findOne({ email });

    // Generate OTP and expiration time (10 minutes)
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    if (tempUser) {
      // Update existing temp user
      tempUser.emailVerificationToken = otp;
      tempUser.emailVerificationExpires = expiresAt;
      tempUser.lastOtpSentAt = new Date();
      await tempUser.save();
    } else {
      // Create new temp user
      tempUser = await TempMail.create({
        name,
        email,
        password,
        role,
        avatar,
        location,
        facebookLink,
        instagramLink,
        skills,
        education,
        experience,
        certifications,
        companyName,
        companyDescription,
        companyLogo,
        companyLocation,
        companyWebsiteLink,
        companySize,
        companyRegistrationNumber,
        panNumber,
        emailVerificationToken: otp,
        emailVerificationExpires: expiresAt,
        lastOtpSentAt: new Date(),
      });
    }

    // Send OTP email
    await sendOTPEmail(email, name, otp);

    res.status(200).json({
      message: "Verification email sent",
      email: tempUser.email,
    });
  } catch (err) {
    console.error("Send verification email error:", err);
    res.status(500).json({ message: "Failed to send verification email" });
  }
};

// Verify OTP and create user account
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find temp user
    const tempUser = await TempMail.findOne({ email });
    if (!tempUser) {
      return res.status(400).json({ message: "Invalid verification request" });
    }

    // Check if OTP is expired
    if (new Date() > tempUser.emailVerificationExpires) {
      return res.status(400).json({ message: "Verification code has expired" });
    }

    // Verify OTP
    if (tempUser.emailVerificationToken !== otp) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Create user account
    const user = await User.create({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      role: tempUser.role,
      avatar: tempUser.avatar,
      location: tempUser.location,
      facebookLink: tempUser.facebookLink,
      instagramLink: tempUser.instagramLink,
      skills: tempUser.skills,
      education: tempUser.education,
      experience: tempUser.experience,
      certifications: tempUser.certifications,
      companyName: tempUser.companyName,
      companyDescription: tempUser.companyDescription,
      companyLogo: tempUser.companyLogo,
      companyLocation: tempUser.companyLocation,
      companyWebsiteLink: tempUser.companyWebsiteLink,
      companySize: tempUser.companySize,
      companyRegistrationNumber: tempUser.companyRegistrationNumber,
      panNumber: tempUser.panNumber,
      isEmailVerified: true,
    });

    // Delete temp user
    await TempMail.deleteOne({ _id: tempUser._id });

    // Generate JWT token
    const token = generateJwtToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: token,
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
    console.error("Verify email error:", err);
    res.status(500).json({ message: "Failed to verify email" });
  }
};

// Resend OTP
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Find temp user
    const tempUser = await TempMail.findOne({ email });
    if (!tempUser) {
      return res.status(400).json({ message: "No verification request found" });
    }

    // Rate limiting: 5-minute cooldown
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    if (tempUser.lastOtpSentAt && tempUser.lastOtpSentAt > fiveMinutesAgo) {
      const remainingTime = Math.ceil(
        (tempUser.lastOtpSentAt.getTime() + 5 * 60 * 1000 - now.getTime()) /
          1000 /
          60,
      );
      return res.status(429).json({
        message: `Please wait ${remainingTime} minutes before requesting another OTP`,
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Update temp user
    tempUser.emailVerificationToken = otp;
    tempUser.emailVerificationExpires = expiresAt;
    tempUser.lastOtpSentAt = now;
    await tempUser.save();

    // Send OTP email
    await sendOTPEmail(email, tempUser.name, otp);

    res.status(200).json({ message: "Verification email resent" });
  } catch (err) {
    console.error("Resend verification error:", err);
    res.status(500).json({ message: "Failed to resend verification email" });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Only check User model (verified accounts)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token and expiration (15 minutes)
    const resetToken = generateToken();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    // Save reset token to user
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = expiresAt;
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;

    // Send reset email
    await sendPasswordResetEmail(email, user.name, resetUrl);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Failed to send password reset email" });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { email, token, password } = req.body;

    // Only check User model (verified accounts)
    const user = await User.findOne({
      email,
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Update password and clear reset token
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Failed to reset password" });
  }
};
