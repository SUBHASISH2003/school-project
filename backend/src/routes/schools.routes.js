import { Router } from "express";
import { upload } from "../middleware/upload.js";
import { createSchoolRules } from "../validators/schools.validators.js";
import { addSchool, getSchools } from "../controllers/school.controller.js";

const router = Router();

// POST /api/school
router.post("/", upload.single("image"), createSchoolRules, addSchool);

// GET /api/schools
router.get("/", getSchools);

export default router;
