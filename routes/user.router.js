import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  logoutUser,
  getAllUsers,
  passwordReset,
  changePassword,
} from "./user.controller";

import express from "express";
const router = express.Router();

router.route("/user/register").post(registerUser);
router.route("/user/login").get(loginUser);
router.route("/current-user").get(getUserProfile);
router.route("/update-user-profile").put(updateUserProfile);
router.route("/user-delete").delete(deleteUserAccount);
router.route("/user-logout").post(logoutUser);
router.route("/all-user").get(getAllUsers);
router.route("/resetpassword").put(passwordReset);
router.route("/change_password").put(changePassword);

export  { router as userRouter};