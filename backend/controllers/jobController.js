const Job = require("../models/Job");
const User = require("../models/User");
const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");

//create job (employer only)
exports.createJob = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employer can post jobs" });
    }
    const job = await Job.create({ ...req.body, company: req.user._id });
    res.status(201).json(job);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//get all jobs
exports.getJobs = async (req, res) => {
  const { keyword, location, category, type, userId } = req.query;

  const query = {
    isClosed: false,
    ...(keyword && { title: { $regex: keyword, $options: "i" } }),
    ...(location && { title: { $regex: location, $options: "i" } }),
    ...(category && { category }),
    ...(type && { type }),
  };
  try {
    const jobs = await Job.find(query).populate(
      "company",
      "name companyName companyLogo"
    );

    let appliedJobStatusMap = {};
    let savedJobIds = [];

    if (userId) {
      //saved jobs
      const SavedJobs = await SavedJob.find({ jobSeeker: userId }).select(
        "job"
      );
      savedJobIds = SavedJobs.map((s) => String(s.job));
      //Applications
      const applications = await Application.find({ applicant: userId }).select(
        "job status"
      );
      applications.forEach((app) => {
        appliedJobStatusMap[String(app.job)] = app.status;
      });
    }

    //add application status and saved jobs to each job
    const jobsWithExtras = jobs.map((job) => {
      const jobIdStr = String(job._id);
      return {
        ...job.toObject(),
        isSaved: savedJobIds.includes(jobIdStr),
        applicationStatus: appliedJobStatusMap[jobIdStr],
      };
    });
    res.json(jobsWithExtras);
  } catch (err) {
    return res.status(500).json({ message: err.message });
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
      .populate("company", "name companyName companyLogo")
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
      })
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
      "name companyName companyLogo avatar email companyDescription"
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

//update job (no need for now, can use in future if required)

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.company.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this job" });
    }

    Object.assign(job, req.body);
    const updated = await job.save();
    res.json(updated);
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
    res.json({ message: "Job closed" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
