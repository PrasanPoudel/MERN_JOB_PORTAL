const Application = require("../models/Application");
const Job = require("../models/Job");
const TFIDFSimilarity = require("../utils/tfidfSimilarity");

// apply to a job
exports.applyToJob = async (req, res) => {
  try {
    if (req.user.role !== "jobSeeker") {
      return res.status(403).json({ message: "Only job seekers can apply" });
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
      cosineSimilarity: cosineSimilarityScore,
    });

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

// update application status (employer only)
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
