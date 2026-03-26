const axios = require("axios");
const Job = require("../models/Job");
const User = require("../models/User");
const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");
const TFIDFSimilarity = require("../utils/tfidfSimilarity");
const JobRecommendationService = require("../services/jobRecommendationService");

// FastAPI server URL
const FRAUD_PREDICTOR_API_URL = process.env.FRAUD_PREDICTOR_API_URL;

//create job (employer only)
exports.createJob = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employer can post jobs" });
    }

    // Check premium constraints for job posting
    if (!req.user.isPremium) {
      // Count active jobs for this employer
      const activeJobCount = await Job.countDocuments({
        company: req.user._id,
        isClosed: false,
      });

      if (activeJobCount >= 1) {
        return res.status(403).json({
          message:
            "Job posting limit reached. Non-premium employers can have only 1 active job posting at a time.",
        });
      }
    }

    const employer = await User.findById(req.user._id);

    const hasCompanyLogo = employer.companyLogo ? 1 : 0;

    const salaryMin = req.body.salaryMin || 0;
    const salaryMax = req.body.salaryMax || 0;
    const salaryRange = `${salaryMin} - ${salaryMax}`;

    // Validate no_of_vacancy
    const noOfVacancy = req.body.no_of_vacancy;
    if (
      !noOfVacancy ||
      !Number.isInteger(Number(noOfVacancy)) ||
      Number(noOfVacancy) <= 0
    ) {
      return res
        .status(400)
        .json({ message: "Number of vacancies must be a positive integer" });
    }

    // Validate application_deadline_date
    const applicationDeadlineDate = new Date(
      req.body.application_deadline_date,
    );
    if (!applicationDeadlineDate || isNaN(applicationDeadlineDate.getTime())) {
      return res.status(400).json({
        message:
          "Application deadline date is required and must be a valid date",
      });
    }

    if (applicationDeadlineDate <= new Date()) {
      return res
        .status(400)
        .json({ message: "Application deadline must be in the future" });
    }

    const jobDataForML = {
      title: req.body.title || "",
      description: req.body.description || "",
      requirements: req.body.requirements || "",
      benefits: req.body.offer || "",
      company_profile: employer.companyDescription,
      location: req.body.location,
      department: req.body.category,
      salary_range: salaryRange,
      employment_type: req.body.type,
      required_experience: req.body.experienceLevel,
      required_education: req.body.educationLevel,
      has_company_logo: hasCompanyLogo,
    };

    // Call FastAPI server for fraud prediction
    let fraudScore = 0;
    try {
      const response = await axios.post(
        `${FRAUD_PREDICTOR_API_URL}/predict`,
        jobDataForML,
        {
          timeout: 8000,
        },
      );
      fraudScore = Number(response?.data?.fraudScore.toFixed(4)) || 0;
    } catch (error) {
      console.error("Fraud predictor API error:", error.message);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      } else if (error.request) {
        console.error("No response received. Request was:", error.request);
      } else {
        console.error("Error details:", error);
      }
    }

    const job = await Job.create({
      ...req.body,
      company: req.user._id,
      fraudScore,
    });

    try {
      JobRecommendationService.processJobRecommendations(job._id)
        .then((result) => {
          console.log(
            `Job recommendations processed for job ${job._id}:`,
            result.message,
          );
        })
        .catch((error) => {
          console.error(
            `Failed to process job recommendations for job ${job._id}:`,
            error.message,
          );
          // Don't throw error - job creation should succeed even if recommendations fail
        });
    } catch (error) {
      console.error(
        `Error sending job recommendations for job ${job._id}:`,
        error.message,
      );
      // Continue with job creation response even if recommendation trigger fails
    }

    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get all jobs with backend pagination

exports.getJobs = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 9,
      keyword,
      location,
      category,
      type,
      userId,
    } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);

    // Build query
    const query = {
      isClosed: false,
      ...(category && { category }),
      ...(type && { type }),
    };
    if (keyword && keyword.trim()) {
      const companies = await User.find({
        companyName: { $regex: keyword, $options: "i" },
        role: "employer",
      }).select("_id");

      const companyIds = companies.map((c) => c._id);

      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { company: { $in: companyIds } },
      ];
    }
    if (location && location.trim()) {
      query.location = { $regex: location, $options: "i" };
    }
    const jobs = await Job.find(query).populate({
      path: "company",
      select:
        "name companyName companyLogo avatar email companyDescription panNumber companyRegistrationNumber companySize companyLocation employerProfile companyWebsiteLink isCompanyVerified",
    });

    let appliedJobStatusMap = {};
    let savedJobIds = [];
    let user = null;

    // User data
    if (userId) {
      user = await User.findById(userId);

      const savedJobs = await SavedJob.find({ jobSeeker: userId }).select(
        "job",
      );
      savedJobIds = savedJobs.map((s) => String(s.job));

      const applications = await Application.find({ applicant: userId }).select(
        "job status",
      );

      applications.forEach((app) => {
        appliedJobStatusMap[String(app.job)] = app.status;
      });
    }
    let jobsWithExtras = jobs.map((job) => {
      const jobIdStr = String(job._id);

      const cosineSimilarityScore = user
        ? TFIDFSimilarity.calculateSimilarity(user, job)
        : 0;

      return {
        ...job.toObject(),
        isSaved: savedJobIds.includes(jobIdStr),
        applicationStatus: appliedJobStatusMap[jobIdStr] || null,
        cosineSimilarityScore,
      };
    });
    jobsWithExtras.sort((a, b) => {
      if (b.cosineSimilarityScore !== a.cosineSimilarityScore) {
        return b.cosineSimilarityScore - a.cosineSimilarityScore;
      }
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
    const total = jobsWithExtras.length;
    const start = (pageNum - 1) * limitNum;
    const end = start + limitNum;
    const paginatedJobs = jobsWithExtras.slice(start, end);

    res.json({
      jobs: paginatedJobs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: end < total,
        hasPrevPage: start > 0,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
//get employer posted jobs
exports.getJobsEmployer = async (req, res) => {
  try {
    const userId = req.user._id;
    const { role } = req.user;
    if (role !== "employer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const jobs = await Job.find({ company: userId })
      .populate(
        "company",
        "name companyName companyLogo avatar email companyDescription panNumber companyRegistrationNumber companySize companyLocation employerProfile companyWebsiteLink isCompanyVerified",
      )
      .lean(); // lean() to makes it a js object

    //count applications for each job
    const jobsWithApplicationCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount = await Application.countDocuments({
          job: job._id,
        });
        return {
          ...job,
          applicationCount,
        };
      }),
    );
    res.json(jobsWithApplicationCounts);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//get single job by id
exports.getJobById = async (req, res) => {
  try {
    const { userId } = req.query;
    const job = await Job.findById(req.params.id).populate(
      "company",
      "name companyName companyLogo avatar email companyDescription panNumber companyRegistrationNumber companySize companyLocation employerProfile companyWebsiteLink isCompanyVerified",
    );
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    let applicationStatus = null;

    if (userId) {
      const application = await Application.findOne({
        job: job._id,
        applicant: userId,
      }).select("status");
      if (application) {
        applicationStatus = application.status;
      }
    }
    return res.json({ ...job.toObject(), applicationStatus });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//delete job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.company.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this job" });
    }
    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//toggle job status (employer only)
exports.toggleCloseJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.company.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to close this job" });
    }
    job.isClosed = !job.isClosed;
    await job.save();
    res.json({ message: job.isClosed ? "Job closed" : "Job reopened" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
