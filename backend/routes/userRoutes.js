const express = require("express");
const {
  updateProfile,
  deleteResume,
  getPublicProfile,
  deleteUser,
  changePassword,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.put("/profile", protect, updateProfile);
router.post("/resume", protect, deleteResume);
router.post("/change-password", protect, changePassword);
router.delete("/delete-user/:email", protect, deleteUser);
router.get("/:id", protect, getPublicProfile);

module.exports = router;
