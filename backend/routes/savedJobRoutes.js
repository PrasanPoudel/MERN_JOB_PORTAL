const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  saveJob,
  unsaveJob,
  getMySavedJobs,
} = require("../controllers/savedJobController");

const router = express.Router();

router.get("/my", protect, getMySavedJobs);
router.post("/:jobId", protect, saveJob);
router.delete("/:jobId", protect, unsaveJob);

module.exports = router;
