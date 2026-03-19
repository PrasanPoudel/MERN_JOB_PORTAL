const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");
const TFIDFSimilarity = require("../utils/tfidfSimilarity");
const { sendStatusChangeEmail } = require("../services/emailService");

// apply to a job
exports.applyToJob = async (req, res) => {
  try {
    if (req.user.role !== "jobSeeker") {
      return res.status(403).json({ message: "Only job seekers can apply" });
    }

    // Check premium constraints for job applications
    if (!req.user.isPremium) {
      // Check if monthly reset is needed
      const now = new Date();
      const resetDate = new Date(req.user.applicationCountResetDate);
      
      // Reset counter if we're in a new month
      if (now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()) {
        req.user.monthlyApplicationCount = 0;
        req.user.applicationCountResetDate = now;
        await req.user.save();
      }
      
      // Check application limit
      if (req.user.monthlyApplicationCount >= 3) {
        return res.status(403).json({ 
          message: "Application limit reached. Non-premium users can apply to only 3 jobs per month." 
        });
      }
    }

    const existing = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user._id,
    });

    if (existing) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

    if (req.user.resume === "" || req.user.resume === null) {
      return res
        .status(403)
        .json({ message: "Resume is required to apply for job" });
    }

    // Fetch the job details to calculate similarity
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Calculate cosine similarity score using TF-IDF algorithm
    const cosineSimilarityScore = TFIDFSimilarity.calculateSimilarity(
      req.user,
      job,
    );

    const application = await Application.create({
      job: req.params.jobId,
      applicant: req.user._id,
      resume: req.user.resume,
      cosineSimilarityScore: cosineSimilarityScore,
    });

    // Increment application counter for non-premium users
    if (!req.user.isPremium) {
      req.user.monthlyApplicationCount += 1;
      await req.user.save();
    }

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get my applications
exports.getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.user._id })
     .populate(
      {
        path: "job",
        populate: {
          path: "company",
          select: "name companyName companyLogo avatar email companyDescription panNumber companyRegistrationNumber companySize companyLocation employerProfile companyWebsiteLink isCompanyVerified",
        },
      }).sort({ createdAt: -1 });

    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get all applicants for a job (employer only)
exports.getApplicantsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job || job.company.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to view applicants" });
    }

    const applications = await Application.find({
      job: req.params.jobId,
    })
      .populate("job", "title location category type")
      .populate("applicant", "name email avatar resume");

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get application id (both job seeker and employer)
exports.getApplicationById = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id)
      .populate("job", "title")
      .populate("applicant", "name email avatar resume");
    if (!app) {
      return res
        .status(404)
        .json({ message: "Application not found.", id: req.params.id });
    }
    const isOwner =
      app.applicant._id.toString() === req.user._id.toString() ||
      app.job.company.toString() === req.user._id.toString();

    if (!isOwner) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this application" });
    }
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// change application status with email notification (employer only)
exports.changeApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const app = await Application.findById(req.params.id)
      .populate("job", "title company")
      .populate("applicant", "name email");

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (app.job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this application" });
    }

    app.status = status;
    await app.save();

    // Send email notification
    try {
      await sendStatusChangeEmail(
        app.applicant.email,
        app.applicant.name,
        app._id,
        status,
        app.job.title
      );
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // Continue even if email fails
    }

    res.status(200).json({ 
      message: "Application status updated successfully", 
      status,
      application: app 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update application status (employer only) - legacy method
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const app = await Application.findById(req.params.id).populate("job");
    if (!app || app.job.company.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this application" });
    }
    app.status = status;
    await app.save();
    res.status(200).json({ message: "Application status updated", status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
