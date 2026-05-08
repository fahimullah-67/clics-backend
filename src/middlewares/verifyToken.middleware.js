import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

const verifyToken = async (req, res, next) => {
  try {
    console.log("Verifying token for incoming request...");
    const token = req.cookies?.jwt;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.payload;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// Middleware to check if the user is authorized (can be reused for updates/deletes)
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    console.log("role of User", req.user.role);
    console.log("check User", req.user);

    if (req.user.id === req.params.userId || req.user.role === "admin") {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
};

// Middleware to check if the user is an Admin (for product creation/updates)
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, async () => {
    // console.log("Role of User", req.user.role);
    try {
      const user = await User.findById(req.user.userid);

      // console.log("check role IsAdmin", user);
      if (user.role === "admin") {
        // console.log("check role IsAdmin", user);
        // console.log("role of admin", user.role);

        next();
      } else {
        // console.log("check role IsAdmin", user);
        console.log("role of admin", user.role);
        res
          .status(403)
          .json("You must be an Administrator to perform this action!");
      }
    } catch (error) {
      res.status(500).json("Error occurred while verifying admin status");
    }
  });
};

export { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };
