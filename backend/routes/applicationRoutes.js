const express = require("express");
const {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  getApplicationById,
  updateStatus
} = require("../controllers/applicationController");
const { protect } = require("../middlewares/authMiddleware");
const { checkBan } = require("../middlewares/banCheckMiddleware");

const router = express.Router();

router.post("/:jobId", protect, checkBan, applyToJob);
router.get("/my", protect, checkBan, getMyApplications);
router.get("/job/:jobId", protect, checkBan, getApplicantsForJob);
router.get("/:id", protect, checkBan, getApplicationById);
router.put("/:id/status", protect, checkBan, updateStatus);

module.exports = router;
