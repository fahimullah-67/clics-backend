import {Router } from "express";
import { clearAllNotifications, createNotification, deleteNotification, getUserNotifications, markAllAsRead, markAsRead } from "../controllers/notification.controller.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";


const router = Router();

router.route("/createNotification").post( verifyToken, createNotification);
router.route("/getAllNotifications").get(verifyToken, getUserNotifications);
router.route("/markAsRead/:id").put(verifyToken, markAsRead);
router.route("/markAllAsRead").put(verifyToken, markAllAsRead);
router.route("/deleteNotification/:id").delete(verifyToken, deleteNotification);
router.route("/clearAllNotifications").delete(verifyToken, clearAllNotifications);


export  {router as  notificationRouter};