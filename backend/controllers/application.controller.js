import { Application } from "../models/application.model.js";

import Job from "../models/job.model.js"; // ✅ Fix import

// Apply for a job
export const applyJob = async (req, res, next) => {
  try {
    const userId = req.user?.id; // ✅ Ensure userId is extracted correctly
    const jobId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. User not found.",
        success: false,
      });
    }

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required.",
        success: false,
      });
    }

    // Check if the user has already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    }).lean();
    if (existingApplication) {
      return res.status(409).json({
        message: "You have already applied for this job.",
        success: false,
      });
    }

    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res
        .status(404)
        .json({ message: "Job not found.", success: false });
    }

    // Create a new application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId, // ✅ Ensure userId is passed
    });

    // Update job document (atomic update)
    await Job.findByIdAndUpdate(jobId, {
      $push: { applications: newApplication._id },
    });

    return res.status(201).json({
      message: "Job applied successfully.",
      success: true,
    });
  } catch (error) {
    next(error);
  }
}; //works fine

// Get applied jobs for a user
export const getAppliedJobs = async (req, res, next) => {
  try {
    const userId = req.user.id; // ✅ Fix variable name
    const applications = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        populate: { path: "company" },
      })
      .lean();

    return res.status(200).json({
      applications,
      success: true,
    });
  } catch (error) {
    next(error);
  }
}; //works

// Get applicants list for a job (Admin)
export const getApplicants = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId)
      .populate({
        path: "applications", // ✅ Fix path (should be plural)
        options: { sort: { createdAt: -1 } },
        populate: { path: "applicant" },
      })
      .lean();

    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    return res.status(200).json({ job, success: true });
  } catch (error) {
    next(error);
  }
};

// Update application status
export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status) {
      return res
        .status(400)
        .json({ message: "Status is required.", success: false });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res
        .status(404)
        .json({ message: "Application not found.", success: false });
    }

    application.status = status.toLowerCase();
    await application.save();

    return res
      .status(200)
      .json({ message: "Status updated successfully.", success: true });
  } catch (error) {
    next(error);
  }
};
