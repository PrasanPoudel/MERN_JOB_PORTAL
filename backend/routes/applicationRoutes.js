const express = require("express");
const {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  getApplicationById,
  updateStatus,
  changeApplicationStatus,
} = require("../controllers/applicationController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/:jobId", protect, applyToJob);
router.get("/my", protect, getMyApplications);
router.get("/job/:jobId", protect, getApplicantsForJob);
router.get("/:id", protect, getApplicationById);
router.put("/:id/status", protect, updateStatus);
router.put("/:id/change-status", protect, changeApplicationStatus);

module.exports = router;
