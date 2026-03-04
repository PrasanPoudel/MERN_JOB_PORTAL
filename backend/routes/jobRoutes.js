const express = require("express");
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  toggleCloseJob,
  getJobsEmployer,
} = require("../controllers/jobController");
const { protect } = require("../middlewares/authMiddleware");
const { checkBan } = require("../middlewares/banCheckMiddleware");
const router = express.Router();

router.route("/").post(protect, checkBan, createJob).get(getJobs);
router.route("/get-jobs-employer").get(protect, checkBan, getJobsEmployer);
router.route("/:id").get(getJobById).put(protect, checkBan, updateJob).delete(protect, checkBan, deleteJob);
router.put("/:id/toggle-close", protect, checkBan, toggleCloseJob);

module.exports = router;
