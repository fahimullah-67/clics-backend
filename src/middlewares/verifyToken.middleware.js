import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      throw new ApiError(401, "Please login first");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.payload;

    next();
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token");
  }
};

// Middleware to check if the user is authorized (can be reused for updates/deletes)
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    console.log("role of User", req.user.role);

    if (req.user.id === req.params.userId || req.user.role === "admin") {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
};

// Middleware to check if the user is an Admin (for product creation/updates)
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "admin") {
      console.log("role of admin", req.user.role);

      next();
    } else {
      console.log("role of admin", req.user.role);
      res
        .status(403)
        .json("You must be an Administrator to perform this action!");
    }
  });
};

export { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };