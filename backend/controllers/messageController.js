const Message = require("../models/Message");
const Application = require("../models/Application");
const User = require("../models/User");
const Job = require("../models/Job");

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { applicationId, recipientId, content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    // Verify application exists and user is involved
    const application = await Application.findById(applicationId)
      .populate("job")
      .populate("applicant")
      .populate("job", "company");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if application is in "In Interview" status
    if (application.status !== "In Interview") {
      return res.status(403).json({
        message: "Chat only available for applications in interview stage",
      });
    }

    // Verify sender is either applicant or employer
    const isApplicant =
      application.applicant._id.toString() === req.user._id.toString();
    const isEmployer =
      application.job.company.toString() === req.user._id.toString();

    if (!isApplicant && !isEmployer) {
      return res
        .status(403)
        .json({ message: "Not authorized to send message" });
    }

    // Create message
    const message = await Message.create({
      application: applicationId,
      sender: req.user._id,
      senderRole: req.user.role,
      recipient: recipientId,
      content,
    });

    // Populate message before sending
    await message.populate([
      { path: "sender", select: "name avatar" },
      { path: "recipient", select: "name avatar" },
    ]);

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get messages for a conversation (application)
exports.getConversation = async (req, res) => {
  try {
    const { applicationId } = req.params;

    // Verify application exists
    const application = await Application.findById(applicationId)
      .populate("job")
      .populate("applicant");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Verify user is involved
    const isApplicant =
      application.applicant._id.toString() === req.user._id.toString();
    const isEmployer =
      application.job.company._id.toString() === req.user._id.toString();

    if (!isApplicant && !isEmployer) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Get all messages for this conversation
    const messages = await Message.find({ application: applicationId })
      .populate("sender", "name avatar email role")
      .sort({ createdAt: 1 });

    // Mark messages as read for the current user
    await Message.updateMany(
      { application: applicationId, recipient: req.user._id },
      { read: true },
    );

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all conversations for the current user
exports.getConversations = async (req, res) => {
  try {
    // Get applications where user is involved and status is "In Interview"
    const applications = await Application.find({
      $or: [
        { applicant: req.user._id },
        {
          job: {
            $in: await User.findById(req.user._id).then((u) => (u ? [] : [])),
          },
        },
      ],
      status: "In Interview",
    })
      .populate("job", "title company")
      .populate("applicant", "name avatar email")
      .populate({
        path: "job",
        populate: { path: "company", select: "name avatar companyName" },
      })
      .sort({ updatedAt: -1 });

    // For each application, get the last message
    const conversations = await Promise.all(
      applications.map(async (app) => {
        const lastMessage = await Message.findOne({
          application: app._id,
        })
          .sort({ createdAt: -1 })
          .populate("sender", "name avatar")
          .exec();

        const unreadCount = await Message.countDocuments({
          application: app._id,
          recipient: req.user._id,
          read: false,
        });

        return {
          application: app,
          lastMessage,
          unreadCount,
        };
      }),
    );

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all conversations
exports.getConversationsV2 = async (req, res) => {
  try {
    const userId = req.user._id;
    let applications;

    if (req.user.role === "jobSeeker") {
      // Job seeker: get applications they initiated that are in interview
      applications = await Application.find({
        applicant: userId,
        status: "In Interview",
      });
    } else {
      // Employer: get applications for their jobs that are in interview
      const userJobs = await Job.find({
        company: userId,
      });
      const jobIds = userJobs.map((j) => j._id);
      applications = await Application.find({
        job: { $in: jobIds },
        status: "In Interview",
      });
    }

    // Populate details and get last message
    const conversations = await Promise.all(
      applications.map(async (app) => {
        await app.populate("job", "title company");
        await app.populate("applicant", "name avatar email");
        await app.populate({
          path: "job",
          populate: { path: "company", select: "name avatar companyName" },
        });

        const lastMessage = await Message.findOne({
          application: app._id,
        })
          .sort({ createdAt: -1 })
          .populate("sender", "name avatar")
          .exec();

        const unreadCount = await Message.countDocuments({
          application: app._id,
          recipient: userId,
          read: false,
        });

        return {
          application: app,
          lastMessage,
          unreadCount,
          jobTitle: app.job?.title,
          companyName: app.job?.company?.companyName,
          applicantName: app.applicant?.name,
          applicantAvatar: app.applicant?.avatar,
        };
      }),
    );

    res.json(
      conversations.sort((a, b) => {
        const aTime = a.lastMessage?.createdAt || a.application.updatedAt;
        const bTime = b.lastMessage?.createdAt || b.application.updatedAt;
        return new Date(bTime) - new Date(aTime);
      }),
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get total unread message count for the current user
exports.getTotalUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Count all unread messages where the current user is the recipient
    const totalUnreadCount = await Message.countDocuments({
      recipient: userId,
      read: false,
    });

    res.json({ totalUnreadCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user's admin messages
exports.getUserAdminMessages = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all messages between user and admin
    const messages = await Message.find({
      $or: [
        { sender: userId, isAdminMessage: true },
        { recipient: userId, senderRole: "admin", isAdminMessage: true },
      ],
      application: null,
    })
      .populate("sender", "name avatar email role")
      .populate("recipient", "name avatar email role")
      .sort({ createdAt: 1 });

    // Mark messages as read for the current user
    await Message.updateMany(
      { recipient: userId, senderRole: "admin", isAdminMessage: true },
      { read: true },
    );

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Send message to admin (for users)
exports.sendMessageToAdmin = async (req, res) => {
  try {
    const { content } = req.body;

    // Get admin
    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Create message
    const message = await Message.create({
      application: null,
      sender: req.user._id,
      senderRole: req.user.role,
      recipient: admin._id,
      content,
      isAdminMessage: true,
    });

    // Populate message before sending
    await message.populate([
      { path: "sender", select: "name avatar" },
      { path: "recipient", select: "name avatar" },
    ]);

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
