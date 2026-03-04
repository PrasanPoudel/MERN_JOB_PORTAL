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
const { checkBan } = require("../middlewares/banCheckMiddleware");

const router = express.Router();

router.post("/:jobId", protect, checkBan, applyToJob);
router.get("/my", protect, checkBan, getMyApplications);
router.get("/job/:jobId", protect, checkBan, getApplicantsForJob);
router.get("/:id", protect, checkBan, getApplicationById);
router.put("/:id/status", protect, checkBan, updateStatus);
router.put("/:id/change-status", protect, checkBan, changeApplicationStatus);

module.exports = router;
