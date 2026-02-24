const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Message = require("../models/Message");

// Get admin dashboard stats
exports.getAdminStats = async (req, res) => {
  try {

    // Get total users
    const totalUsers = await User.countDocuments({
      role: { $in: ["jobSeeker", "employer"] },
    });

    // Get total job seekers
    const totalJobSeekers = await User.countDocuments({ role: "jobSeeker" });

    // Get total employers
    const totalEmployers = await User.countDocuments({ role: "employer" });

    // Get total premium users
    const totalPremiumUsers = await User.countDocuments({ isPremium: true });

    // Get total active jobs
    const totalActiveJobs = await Job.countDocuments({ isClosed: false });

    // Get total jobs
    const totalJobs = await Job.countDocuments({});

    // Get recent users
    const recentUsers = await User.find({
      role: { $in: ["jobSeeker", "employer"] },
    })
      .select("name email role avatar isPremium createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      counts: {
        totalUsers,
        totalJobSeekers,
        totalEmployers,
        totalPremiumUsers,
        totalActiveJobs,
        totalJobs,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch admin stats", error: err.message });
  }
};

// Get all users for management
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { role, search } = req.query;

    let query = { role: { $in: ["jobSeeker", "employer"] } };

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get additional stats for the user
    let userStats = {};

    if (user.role === "jobSeeker") {
      const appliedJobs = await Application.countDocuments({
        applicant: user._id,
      });
      const savedJobs = await User.aggregate([
        { $match: { _id: user._id } },
        {
          $lookup: {
            from: "savedjobs",
            localField: "_id",
            foreignField: "jobSeeker",
            as: "saved",
          },
        },
        { $project: { savedCount: { $size: "$saved" } } },
      ]);
      userStats = {
        appliedJobs,
        savedJobs: savedJobs[0]?.savedCount || 0,
      };
    } else if (user.role === "employer") {
      const postedJobs = await Job.countDocuments({ company: user._id });
      const totalApplications = await Job.aggregate([
        { $match: { company: user._id } },
        {
          $lookup: {
            from: "applications",
            localField: "_id",
            foreignField: "job",
            as: "applications",
          },
        },
        { $group: { _id: null, count: { $sum: { $size: "$applications" } } } },
      ]);
      userStats = {
        postedJobs,
        totalApplications: totalApplications[0]?.count || 0,
      };
    }

    res.json({ ...user.toObject(), stats: userStats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete related data based on user role
    if (user.role === "jobSeeker") {
      // Delete applications
      await Application.deleteMany({ applicant: user._id });
      // Delete saved jobs
      await User.deleteOne({ _id: user._id, role: "jobSeeker" });
    } else if (user.role === "employer") {
      // Get all jobs posted by this employer
      const jobs = await Job.find({ company: user._id });
      const jobIds = jobs.map((j) => j._id);
      // Delete applications for these jobs
      await Application.deleteMany({ job: { $in: jobIds } });
      // Delete jobs
      await Job.deleteMany({ company: user._id });
    }

    // Delete messages where user is sender or recipient
    await Message.deleteMany({
      $or: [{ sender: user._id }, { recipient: user._id }],
    });

    // Delete the user
    await user.deleteOne();

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all jobs for management
exports.getAllJobs = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { status, search } = req.query;

    let query = {};

    if (status === "active") {
      query.isClosed = false;
    } else if (status === "closed") {
      query.isClosed = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const jobs = await Job.find(query)
      .populate("company", "name companyName email companyLogo")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete job by admin
exports.deleteJobByAdmin = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Delete all applications related to this job
    await Application.deleteMany({ job: job._id });

    // Delete the job
    await job.deleteOne();

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Send admin message to user
exports.sendAdminMessage = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { recipientId, content } = req.body;

    // Verify recipient exists and is not admin
    const recipient = await User.findById(recipientId);
    if (!recipient || recipient.role === "admin") {
      return res.status(404).json({ message: "Invalid recipient" });
    }

    // Create message with special admin conversation marker
    const message = await Message.create({
      application: null,
      sender: req.user._id,
      senderRole: "admin",
      recipient: recipientId,
      content,
      isAdminMessage: true,
    });

    // Populate message before sending
    await message.populate("sender", "name avatar");
    await message.populate("recipient", "name avatar");

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get admin conversations
exports.getAdminConversations = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const adminId = req.user._id;

    // Get all unique users who have chatted with admin
    const messages = await Message.find({
      $or: [
        { sender: adminId, isAdminMessage: true },
        { recipient: adminId, senderRole: "admin" },
      ],
      application: null,
    }).lean();

    // Get unique user IDs
    const userIds = new Set();
    messages.forEach((msg) => {
      if (msg.sender.toString() === adminId.toString()) {
        userIds.add(msg.recipient.toString());
      } else {
        userIds.add(msg.sender.toString());
      }
    });

    // Get conversation data
    const conversations = await Promise.all(
      Array.from(userIds).map(async (userId) => {
        const user = await User.findById(userId).select(
          "_id name avatar email",
        );

        const lastMessage = await Message.findOne({
          $or: [
            { sender: adminId, recipient: userId, application: null },
            { sender: userId, recipient: adminId, application: null },
          ],
        })
          .sort({ createdAt: -1 })
          .populate("sender", "name avatar");

        const unreadCount = await Message.countDocuments({
          sender: userId,
          recipient: adminId,
          read: false,
          application: null,
        });

        return {
          user,
          lastMessage,
          unreadCount,
        };
      }),
    );

    // Sort by last message date
    conversations.sort((a, b) => {
      const aTime = a.lastMessage?.createdAt || new Date(0);
      const bTime = b.lastMessage?.createdAt || new Date(0);
      return new Date(bTime) - new Date(aTime);
    });

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get admin conversation with specific user
exports.getAdminConversation = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { userId } = req.params;
    const adminId = req.user._id;

    // Get all messages between admin and user
    const messages = await Message.find({
      $or: [
        { sender: adminId, recipient: userId, application: null },
        { sender: userId, recipient: adminId, application: null },
      ],
    })
      .populate("sender", "name avatar email role")
      .sort({ createdAt: 1 });

    // Mark messages as read for the current user
    await Message.updateMany(
      { sender: userId, recipient: adminId, application: null },
      { read: true },
    );

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Send message reply as user to admin
exports.sendUserReplyToAdmin = async (req, res) => {
  try {
    const { content } = req.body;

    // Create message
    const message = await Message.create({
      application: null,
      sender: req.user._id,
      senderRole: req.user.role,
      recipient: null, // Will be handled by admin
      content,
      isAdminMessage: true,
    });

    // Find the admin and update recipient
    const admins = await User.find({ role: "admin" }).limit(1);
    if (admins.length > 0) {
      message.recipient = admins[0]._id;
      await message.save();
    }

    // Populate message before sending
    await message.populate("sender", "name avatar");
    await message.populate("recipient", "name avatar");

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get daily analytics for bar graph
exports.getDailyAnalytics = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const dailyData = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const userCount = await User.countDocuments({
        role: { $in: ["jobSeeker", "employer"] },
        createdAt: { $gte: date, $lt: nextDate },
      });

      const jobs = await Job.find({
        createdAt: { $gte: date, $lt: nextDate },
      });

      const jobCount = jobs.length;
      dailyData.push({
        date: date.toISOString().split("T")[0],
        userRegistrations: userCount,
        jobPostings: jobCount,
      });
    }

    res.json(dailyData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get risk distribution for pie chart
exports.getRiskDistribution = async (req, res) => {
  try {
    const allJobs = await Job.find({});

    let safe = 0;
    let moderate = 0;
    let high = 0;

    allJobs.forEach((job) => {
      const score = job.fraudScore || 0;
      if (score <= 0.1) {
        safe++;
      } else if (score <= 0.25) {
        moderate++;
      } else {
        high++;
      }
    });

    res.json([
      { name: "Safe", value: safe },
      { name: "Moderate Risk", value: moderate },
      { name: "High Risk", value: high },
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
