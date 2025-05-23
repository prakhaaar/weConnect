import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const newUser = new User({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while registering the user.",
      success: false,
      error: error.message,
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Fields are empty",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "No user found, please SignUp",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect password",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        message: "Account with this role doesn't exist",
        success: false,
      });
    }

    const tokenId = {
      userId: user._id, // Use user._id directly
    };

    const token = await jwt.sign(tokenId, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const userResponse = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in ms
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user: userResponse,
        success: true,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong during login.",
      success: false,
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;
    const userId = req.user.id; // Adjusted from req.id to req.user.id

    let user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found.", success: false });
    }

    // Initialize profile if it doesn't exist
    if (!user.profile) {
      user.profile = {};
    }

    // Process skills (handle both string and array)
    if (skills) {
      user.profile.skills =
        typeof skills === "string" ? skills.split(",") : skills;
    }

    // Handle file upload
    if (file) {
      user.profile.avatar = file.path; // Adjust based on your storage setup
    }

    // Update fields
    if (fullname !== undefined) user.fullname = fullname;
    if (email !== undefined) user.email = email;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (bio !== undefined) user.profile.bio = bio;

    await user.save();

    // Respond with updated user (exclude sensitive data)
    const userResponse = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    res.status(200).json({
      message: "Profile updated successfully.",
      user: userResponse,
      success: true,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
        success: false,
      });
    }
    // Handle duplicate key errors (e.g., unique email)
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already in use.",
        success: false,
      });
    }
    res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};
