import Company from "../models/company.model.js";

// ✅ Register Company
export const registerCompany = async (req, res) => {
  try {
    console.log("Received Request Body:", req.body);
    console.log("Authenticated User ID:", req.user.id); // Use req.user.id instead of req.id

    const { companyName, location, website, description } = req.body;

    if (!companyName || !location || !website || !description) {
      return res.status(400).json({
        message:
          "All fields (companyName, location, website, description) are required.",
        success: false,
      });
    }

    if (!req.user.id) {
      // Check if the user ID is missing
      return res.status(401).json({
        message: "Unauthorized: User ID is missing.",
        success: false,
      });
    }

    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(400).json({
        message: "A company with this name already exists.",
        success: false,
      });
    }

    company = await Company.create({
      name: companyName,
      userId: req.user.id, // Ensure userId is set properly
      location,
      website,
      description,
    });

    return res.status(201).json({
      message: "Company registered successfully.",
      success: true,
      company,
    });
  } catch (error) {
    console.error("Error registering company:", error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
      error: error.message,
    });
  }
};

// ✅ Get Companies by User ID
export const getCompany = async (req, res) => {
  try {
    const userId = req.id;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is missing in the request",
        success: false,
      });
    }

    const companies = await Company.find({ userId });

    if (!companies || companies.length === 0) {
      return res.status(404).json({
        message: "No companies found for this user",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Companies retrieved successfully",
      success: true,
      data: companies,
    });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};

// ✅ Get Company by ID
export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;

    if (!companyId) {
      return res.status(400).json({
        message: "Company ID is required",
        success: false,
      });
    }

    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "No company found with this ID",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company retrieved successfully",
      success: true,
      company,
    });
  } catch (error) {
    console.error("Error fetching company by ID:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};

// ✅ Update Company Information
export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;

    if (!name && !description && !website && !location) {
      return res.status(400).json({
        message: "At least one field is required to update",
        success: false,
      });
    }

    const updateData = { name, description, website, location };

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true, // ✅ Return the updated document
      runValidators: true, // ✅ Ensures validations are applied
    });

    if (!company) {
      return res.status(404).json({
        message: "No company found with this ID",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company information updated successfully",
      success: true,
      company, // ✅ Return updated company data
    });
  } catch (error) {
    console.error("Error updating company:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};
