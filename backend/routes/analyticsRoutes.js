const express= require("express");
const {protect}= require("../middlewares/authMiddleware");
const {getEmployerAnalytics}= require("../controllers/analyticsController");

const router= express.Router();

router.get("/overview",protect, getEmployerAnalytics);

module.exports= router;
