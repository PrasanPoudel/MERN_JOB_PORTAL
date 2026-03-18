const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
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
      token: generateToken(user._id),
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
      token: generateToken(user._id),
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