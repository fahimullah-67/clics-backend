import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Middleware to verify admin role
 * Must be used after verifyToken middleware
 */
export const verifyAdmin = async (req, res, next) => {
  try {
    // verifyToken middleware should have already set req.user
    if (!req.user) {
      throw new ApiError(401, "Please login first");
    }

    // Find user and check if admin
    const user = await User.findById(req.user.id || req.user.userid);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.role !== "admin") {
      throw new ApiError(403, "Admin access required");
    }

    next();
  } catch (error) {
    res.status(error.statusCode || 403).json({
      success: false,
      message: error.message || "Admin verification failed",
    });
  }
};
