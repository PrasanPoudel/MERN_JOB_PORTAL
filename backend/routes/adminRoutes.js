import express from "express";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import * as adminController from "../controllers/adminController.js";

const router = express.Router();

router.use(adminMiddleware);

router.get("/users", adminController.getUsers);
router.get("/companies", adminController.getCompanies);
router.post("/verify-company/:id", adminController.verifyCompany);
// …rest of admin endpoints

export default router;