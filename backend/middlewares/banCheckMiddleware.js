const User = require("../models/User");

const checkBan = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return next();
    }

    const user = await User.findById(req.user._id).select("isBanned banReason banDate");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isBanned) {
      return res.status(403).json({
        error: "Your account has been banned",
        banReason: user.banReason,
        banDate: user.banDate,
      });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: "Failed to check ban status" });
  }
};

module.exports = { checkBan };
