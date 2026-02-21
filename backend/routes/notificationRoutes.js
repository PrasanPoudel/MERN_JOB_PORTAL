import express from "express";
import * as notificationController from "../controllers/notificationController.js";

const router = express.Router();

router.post("/send-email", notificationController.sendEmail);
router.get("/logs", notificationController.getLogs);

export default router;