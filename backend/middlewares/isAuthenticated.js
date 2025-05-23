import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1]; // ✅ Support both cookies & headers

    if (!token) {
      return res
        .status(401)
        .json({ message: "User not authenticated.", success: false });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY); // ✅ Ensure the correct secret key is used
    req.user = { id: decoded.userId || decoded._id }; // ✅ Handle different JWT payload formats

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Authentication error:", error);
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired.", success: false });
    }
    return res.status(500).json({
      message: "Internal server error during authentication.",
      success: false,
    });
  }
};

export default isAuthenticated;
