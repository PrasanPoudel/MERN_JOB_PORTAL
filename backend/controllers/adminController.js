const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Message = require("../models/Message");
const PremiumSubscription = require("../models/PremiumSubscription");
const { paginateQuery, buildQuery } = require("../utils/pagination");

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

// Get all users for management with backend pagination
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { page = 1, limit = 9, user, role, search } = req.query;

    // Build query for pagination
    const query = { role: { $in: ["jobSeeker", "employer"] } };

    if (role) {
      query.role = role;
    }
    if (user && user !== "all") {
      if (user === "banned") {
        query.isBanned = true;
      } else if (user === "unbanned") {
        query.isBanned = false;
      } else if (user === "premium") {
        query.isPremium = true;
      } else if (user === "nonPremium") {
        query.isPremium = false || undefined;
      }
    }
    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { companyName: { $regex: search.trim(), $options: "i" } },
        { email: { $regex: search.trim(), $options: "i" } },
      ];
    }

    // Use pagination utility
    const result = await paginateQuery(User, query, {
      page,
      limit,
      sort: { createdAt: -1 },
    });

    // Add stats to each user
    const usersWithStats = await Promise.all(
      result.data.map(async (user) => {
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
            {
              $group: {
                _id: null,
                count: { $sum: { $size: "$applications" } },
              },
            },
          ]);
          userStats = {
            postedJobs,
            totalApplications: totalApplications[0]?.count || 0,
          };
        }

        return {
          ...user.toObject(),
          stats: userStats,
        };
      }),
    );

    res.json({
      users: usersWithStats,
      pagination: result.pagination,
    });
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

// Get all jobs for management with backend pagination
exports.getAllJobs = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { page = 1, limit = 9, status, search, sort } = req.query;

    // Build query for pagination
    const query = {};

    if (status === "active") {
      query.isClosed = false;
    } else if (status === "closed") {
      query.isClosed = true;
    }

    let sortOptions = { createdAt: -1 }; // Default sort by creation date descending

    if (sort) {
      switch (sort) {
        case "Posted_Date_(Ascending_Order)":
          sortOptions = { createdAt: 1 };
          break;
        case "Posted_Date_(Descending_Order)":
          sortOptions = { createdAt: -1 };
          break;
        case "Risk_Score_(Ascending_Order)":
          sortOptions = { fraudScore: 1 };
          break;
        case "Risk_Score_(Descending_Order)":
          sortOptions = { fraudScore: -1 };
          break;
        default:
          sortOptions = { createdAt: -1 };
      }
    }

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: "i" };

      const pipeline = [
        {
          $lookup: {
            from: "users",
            localField: "company",
            foreignField: "_id",
            as: "company",
          },
        },
        { $unwind: "$company" },
        {
          $match: {
            $and: [
              query,
              {
                $or: [
                  { title: searchRegex },
                  { description: searchRegex },
                  { "company.name": searchRegex },
                  { "company.companyName": searchRegex },
                ],
              },
            ],
          },
        },
        {
          $project: {
            title: 1,
            description: 1,
            requirements: 1,
            location: 1,
            educationLevel: 1,
            experienceLevel: 1,
            offer: 1,
            type: 1,
            category: 1,
            salaryMin: 1,
            salaryMax: 1,
            isClosed: 1,
            fraudScore: 1,
            createdAt: 1,
            no_of_vacancy: 1,
            application_deadline_date: 1,
            company: {
              _id: 1,
              name: 1,
              companyName: 1,
              email: 1,
              companyLogo: 1,
              isCompanyVerified: 1,
            },
          },
        },
        { $sort: sortOptions },
      ];

      // Get total count for pagination
      const totalJobs = await Job.aggregate([...pipeline, { $count: "total" }]);
      const total = totalJobs[0]?.total || 0;
      const totalPages = Math.ceil(total / limit);

      // Apply pagination
      pipeline.push({ $skip: (page - 1) * limit });
      pipeline.push({ $limit: parseInt(limit) });

      const jobs = await Job.aggregate(pipeline);

      return res.json({
        jobs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages,
        },
      });
    }

    // No search, use normal pagination
    const result = await paginateQuery(Job, query, {
      page,
      limit,
      populate: {
        path: "company",
        select: "name companyName email companyLogo isCompanyVerified",
      },
      sort: sortOptions,
    });

    res.json({
      jobs: result.data,
      pagination: result.pagination,
    });
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

// Mark job as safe (reset fraudScore to 0)
exports.markJobAsSafe = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Reset fraudScore to 0
    job.fraudScore = 0;
    await job.save();

    res.json({
      message: "Job marked as safe successfully",
      job,
    });
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
          "_id name avatar email role",
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
      if (score <= 0.25) {
        safe++;
      } else if (score <= 0.5) {
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

// Get all companies for verification management
exports.getAllCompanies = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { search } = req.query;

    let query = {
      role: "employer",
      companyName: { $exists: true, $ne: "" },
      companyLocation: { $exists: true, $ne: "" },
      companySize: { $exists: true, $ne: "" },
      companyDescription: { $exists: true, $ne: "" },
      panNumber: { $exists: true, $ne: "" },
      companyRegistrationNumber: { $exists: true, $ne: "" },
    };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } },
      ];
    }

    const companies = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get pending companies for verification
exports.getPendingCompanies = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { search } = req.query;

    let query = {
      role: "employer",
      isCompanyVerified: false,
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } },
      ];
    }

    const companies = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get company details for verification
exports.getCompanyDetails = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const company = await User.findById(req.params.id).select("-password");

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    if (company.role !== "employer") {
      return res.status(400).json({ message: "User is not an employer" });
    }

    // Get additional stats for the company
    const postedJobs = await Job.countDocuments({ company: company._id });
    const totalApplications = await Job.aggregate([
      { $match: { company: company._id } },
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

    const companyStats = {
      postedJobs,
      totalApplications: totalApplications[0]?.count || 0,
    };

    res.json({ ...company.toObject(), stats: companyStats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify company
exports.verifyCompany = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const company = await User.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    if (company.role !== "employer") {
      return res.status(400).json({ message: "User is not an employer" });
    }

    // Update company verification status
    company.isCompanyVerified = true;
    await company.save();

    res.json({ message: "Company verified successfully", company });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove company verification
exports.removeCompanyVerification = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const company = await User.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    if (company.role !== "employer") {
      return res.status(400).json({ message: "User is not an employer" });
    }

    // Remove company verification status
    company.isCompanyVerified = false;
    await company.save();

    res.json({ message: "Company verification removed successfully", company });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ban user
exports.banUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({ message: "Ban reason is required" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot ban admin users" });
    }

    if (user.isBanned) {
      return res.status(400).json({ message: "User is already banned" });
    }

    user.isBanned = true;
    user.banReason = reason.trim();
    user.banDate = new Date();
    await user.save();

    res.json({ message: "User banned successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Unban user
exports.unbanUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isBanned) {
      return res.status(400).json({ message: "User is not banned" });
    }

    user.isBanned = false;
    user.banReason = undefined;
    user.banDate = undefined;
    await user.save();

    res.json({ message: "User unbanned successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get revenue stats for admin dashboard
exports.getRevenueStats = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get total revenue from all completed subscriptions
    const totalRevenueResult = await PremiumSubscription.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;
    const totalSubscriptionCount = totalRevenueResult[0]?.count || 0;

    // Get unique premium users for total
    const totalUniqueUsers = await PremiumSubscription.distinct("userId", {
      status: "completed",
    });
    const totalUniqueUserCount = totalUniqueUsers.length;

    // Get revenue for current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const monthlyRevenueResult = await PremiumSubscription.aggregate([
      {
        $match: {
          status: "completed",
          issuedAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);
    const monthlyRevenue = monthlyRevenueResult[0]?.total || 0;
    const monthlySubscriptionCount = monthlyRevenueResult[0]?.count || 0;

    // Get unique premium users for current month
    const monthlyUniqueUsers = await PremiumSubscription.distinct("userId", {
      status: "completed",
      issuedAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
    });
    const monthlyUniqueUserCount = monthlyUniqueUsers.length;

    res.status(200).json({
      totalRevenue,
      monthlyRevenue,
      totalSubscriptions: totalSubscriptionCount,
      monthlySubscriptions: monthlySubscriptionCount,
      totalUniqueUsers: totalUniqueUserCount,
      monthlyUniqueUsers: monthlyUniqueUserCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
