import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
} from "../controllers/job.controller.js";

const router = express.Router();

router.use(isAuthenticated); // ✅ Protect all routes

router.post("/post", postJob);
router.get("/get", getAllJobs);
router.get("/getadminJobs", getAdminJobs);
router.get("/get/:id", getJobById);

export default router;
