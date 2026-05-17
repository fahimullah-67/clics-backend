import Notification from "../models/notifications.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateNotificationContent, getUIType, getCategory } from "../utils/notificationHelper.js";
import { generateEmailHTML } from "../utils/notificationHTMLGenerator.js";
import { sendEmail } from "../utils/sendEmail.js";
// import { sendSMS, generateSMSMessage } from "../utils/notificationSMSSender.js";
// import { notificationService } from "../utils/realTimeNotificationService.js";


// Create Notification
export const createNotification = async (req, res) => {
  try {
    const {userid, email} = req.user;
    const {type, data, actionLink = null, actionText = "View Details"} = req.body;
    
    // Generate notification content based on type and data
    const notificationData = generateNotificationContent(type, data);
    const uiType = getUIType(type);
    const category = getCategory(type);

    const notification = new Notification({
      ...req.body,
      userId: userid,
      title: notificationData.title,
      message: notificationData.message,
      category: category || notificationData.category,
      type: type,
    });

    if(!notification){
      return res.status(400).json(
        new ApiError(400, "Bad Request", "Failed to create notification")
      )
    }

    // Send email if specified
    if (notification.sentVia.includes("EMAIL")) {
      const emailHTML = generateEmailHTML(
        {
          title: notification.title,
          message: notification.message,
          category: notification.category,
          uiType: uiType,
        },
        {
          userName: req.user.name || "User",
          actionLink: actionLink,
          actionText: actionText,
          companyName: "CLICS",
        }
      );

      try {
        await sendEmail(
          email,
          notification.title,
          emailHTML,
          true // indicates HTML email
        );
        // Update delivery status
        notification.deliveryStatus.email.sent = true;
        notification.deliveryStatus.email.sentAt = new Date();
      } catch (emailError) {
        console.error("Email sending failed:", emailError.message);
        notification.deliveryStatus.email.error = emailError.message;
        // Don't throw - continue with other delivery methods
      }
    }

    // if (notification.sentVia.includes("IN_APP")) {
    //   // Send real-time notification via WebSocket
    //   notificationService.notifyUser(userid, {
    //     _id: notification._id,
    //     title: notification.title,
    //     message: notification.message,
    //     category: notification.category,
    //     type: notification.type,
    //     actionLink: actionLink,
    //     actionText: actionText,
    //     priority: notification.priority,
    //     createdAt: new Date(),
    //   }, { includeHTML: true });
    // }

    // if (notification.sentVia.includes("SMS")) {
    //   // Send SMS notification
    //   if (!req.body.phoneNumber) {
    //     console.warn("Phone number not provided for SMS");
    //   } else {
    //     const smsMessage = generateSMSMessage(notification);
    //     const smsResult = await sendSMS(req.body.phoneNumber, smsMessage);
        
    //     if (!smsResult.success) {
    //       console.error("SMS sending failed:", smsResult.error);
    //       // Still save notification even if SMS fails
    //       notification.deliveryStatus.sms.error = smsResult.error;
    //     } else {
    //       notification.deliveryStatus.sms.sent = true;
    //       notification.deliveryStatus.sms.sentAt = new Date();
    //     }
    //   }
    // }

    const savedNotification = await notification.save();

    res.status(201).json(
      new ApiResponse(201,savedNotification, "Notification created")
    );
  } catch (error) {
    console.log("Error creating notification:", error);
    res.status(500).json(
      new ApiError(500, "Internal Server Error", error.message)
    );
  }
};


//  Get All Notifications (User)
export const getUserNotifications = async (req, res) => {
  try {
    console.log("Fetching user notifications...");
    
    const notifications = await Notification.find({
      userId: req.user.userid,
    }).sort({ createdAt: -1 });

    console.log("Get ALL Notification: ", notifications);
    
    res.status(200).json(
      new ApiResponse(200, notifications, "User notifications fetched")
    );
  } catch (error) {
    console.log("Error fetching notifications:", error);
    res.status(500).json(
      new ApiError(500, "Internal Server Error", error.message)
    );
  }
};


//  Mark Single Notification as Read
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    res.status(200).json(
      new ApiResponse(200, notification, "Notification marked as read")
    );
  } catch (error) {
    console.log("Error marking notification:", error);
    res.status(500).json(
      new ApiError(500, "Internal Server Error", error.message)
    );
  }
};


//  Mark All Notifications as Read
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.userid, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.log("Error marking all notifications:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


//  Delete Single Notification
export const deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Notification deleted",
      data: deleted,
    });
  } catch (error) {
    console.log("Error deleting notification:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


//  Clear All Notifications
export const clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ userId: req.user.userid });

    res.status(200).json({
      message: "All notifications cleared",
    });
  } catch (error) {
    console.log("Error clearing notifications:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};