import Job from "../models/job.model.js"; // ✅ Correct Import
import mongoose from "mongoose";

// ✅ POST a new job
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId, // ✅ This will be mapped to `company`
    } = req.body;
    const userId = req.user.id; // ✅ Ensure correct user reference

    // Validate required fields
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !position ||
      !companyId || // ✅ Ensure companyId exists
      !experience
    ) {
      return res
        .status(400)
        .json({ message: "Required field is missing", success: false });
    }

    // Ensure `requirements` is always an array
    const processedRequirements = Array.isArray(requirements)
      ? requirements
      : typeof requirements === "string"
      ? requirements.split(",").map((req) => req.trim())
      : [];

    // ✅ Correct field name for `company`
    const job = await Job.create({
      title,
      description,
      requirements: processedRequirements,
      salary,
      location,
      jobType,
      experience,
      position,
      company: companyId, // ✅ FIXED: Correct field name
      created_by: userId,
    });

    return res.status(201).json({ job, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
}; //works correct now

// ✅ GET all jobs with pagination and keyword search
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const page = parseInt(req.query.page) || 1; // ✅ Pagination support
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query)
      .populate({ path: "company" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalJobs = await Job.countDocuments(query);

    return res.status(200).json({ jobs, totalJobs, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
}; //works fine now

// ✅ GET a job by ID
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id.trim(); // ✅ Trim unwanted whitespace or newlines

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res
        .status(400)
        .json({ message: "Invalid job ID format.", success: false });
    }

    const job = await Job.findById(jobId).populate({ path: "applications" });

    if (!job) {
      return res
        .status(404)
        .json({ message: "Job not found.", success: false });
    }

    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};

// ✅ GET jobs created by an admin
export const getAdminJobs = async (req, res) => {
  try {
    const admin_Id = req.user.id;
    const jobs = await Job.find({ created_by: admin_Id })
      .populate({ path: "company" })
      .sort({ createdAt: -1 });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: "No jobs found", success: false });
    }

    return res.status(200).json({ jobs, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};
