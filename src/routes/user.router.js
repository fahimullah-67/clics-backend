import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  logoutUser,
  getAllUsers,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controller.js";

import express from "express";
const router = express.Router();
import { verifyToken } from "../middlewares/verifyToken.middleware.js";

router.route("/user/register").post(registerUser);
router.route("/user/login").post(loginUser);
router.route("/current-user").get(verifyToken, getUserProfile);
router.route("/update-user-profile").put(verifyToken, updateUserProfile);
router.route("/user-delete").delete(deleteUserAccount);
router.route("/user-logout").post(logoutUser);
router.route("/all-user").get(getAllUsers);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/change_password").put(verifyToken, changePassword);

export { router as userRouter };