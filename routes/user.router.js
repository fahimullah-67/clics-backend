import 
{ 
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    deleteUserAccount,
    logoutUser,
    getAllUsers,
    passwordReset,
    changePassword,
 } 
from "./user.controller";

import express from "express";
const router = express.Router();

router.post("register", registerUser);
router.get("login", loginUser);
router.get("user:/:id", getUserProfile);
router.put("updateProfile/:id", updateUserProfile);
router.delete("delete/:id", deleteUserAccount);
router.post("logout", logoutUser);
router.get("user", getAllUsers);
router.put("resetpassword", passwordReset);
router.put("change_password", changePassword);

export default router;