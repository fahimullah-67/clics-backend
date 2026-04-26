/**
 * Notification Service
 * Handles creating and sending notifications without HTTP request/response
 * Can be called from any module, not just controllers
 */

import Notification from "../models/notifications.model.js";
import {
  generateNotificationContent,
  getUIType,
  getCategory,
} from "../utils/notificationHelper.js";
import {
  generateEmailHTML,
  generateInAppHTML,
  generatePlainTextNotification,
} from "../utils/notificationHTMLGenerator.js";
// import { sendSMS, generateSMSMessage } from "../utils/notificationSMSSender.js";
// import { notificationService as realtimeService } from "../utils/realTimeNotificationService.js";
import { sendEmail } from "../utils/sendEmail.js";

/**
 * Create and send a notification
 * Can be called from any module (controllers, services, scheduled tasks, etc.)
 *
 * @param {Object} params - Notification parameters
 * @param {string} params.userId - User ID
 * @param {string} params.email - User email (required for EMAIL channel)
 * @param {string} params.phoneNumber - User phone (required for SMS channel)
 * @param {string} params.type - Notification type (from NOTIFICATION_TYPES)
 * @param {Object} params.data - Data for notification content generation
 * @param {Array} params.sentVia - Delivery channels: ["EMAIL", "SMS", "IN_APP"]
 * @param {string} [params.priority] - "low" | "medium" | "high"
 * @param {string} [params.actionLink] - Link for action button
 * @param {string} [params.actionText] - Text for action button
 * @param {Object} [params.options] - Additional options
 *
 * @returns {Promise<Object>} - Created notification object
 *
 * @example
 * // From user controller
 * await createNotificationService({
 *   userId: userId,
 *   email: userEmail,
 *   type: "success",
 *   data: { amount: 500000 },
 *   sentVia: ["EMAIL", "IN_APP"],
 *   priority: "high"
 * });
 */
export const createNotificationService = async (params) => {
  const {
    userId,
    email,
    phoneNumber = null,
    type,
    data = {},
    sentVia = ["EMAIL"],
    priority = "medium",
    actionLink = null,
    actionText = "View Details",
    options = {},
    userName = "User",
  } = params;

  try {
    // Validate required fields
    if (!userId) throw new Error("userId is required");
    if (!type) throw new Error("type is required");

    // Generate notification content
    const notificationData = generateNotificationContent(type, data);
    const uiType = getUIType(type);
    const category = getCategory(type);

    // Create notification object
    const notification = new Notification({
      userId,
      type,
      title: notificationData.title,
      message: notificationData.message,
      category: category || notificationData.category,
      priority,
      sentVia,
      actionLink,
      actionText,
    });

    // ========== EMAIL CHANNEL ==========
    if (sentVia.includes("EMAIL") && email) {
      try {
        const emailHTML = generateEmailHTML(
          {
            title: notification.title,
            message: notification.message,
            category: notification.category,
            uiType: uiType,
          },
          {
            userName: userName,
            actionLink: actionLink,
            actionText: actionText,
            companyName: "CLICS",
            ...options.emailOptions,
          }
        );

        await sendEmail(email, notification.title, emailHTML, true);

        notification.deliveryStatus.email.sent = true;
        notification.deliveryStatus.email.sentAt = new Date();

        console.log(` Email sent to ${email}`);
      } catch (emailError) {
        console.error(" Email sending failed:", emailError.message);
        notification.deliveryStatus.email.error = emailError.message;
      }
    }

    // ========== SMS CHANNEL ==========
    if (sentVia.includes("SMS") && phoneNumber) {
      try {
        const smsMessage = generateSMSMessage(notification);
        const smsResult = await sendSMS(phoneNumber, smsMessage);

        if (smsResult.success) {
          notification.deliveryStatus.sms.sent = true;
          notification.deliveryStatus.sms.sentAt = new Date();
          console.log(`✅ SMS sent to ${phoneNumber}`);
        } else {
          notification.deliveryStatus.sms.error = smsResult.error;
          console.error("❌ SMS sending failed:", smsResult.error);
        }
      } catch (smsError) {
        console.error("❌ SMS error:", smsError.message);
        notification.deliveryStatus.sms.error = smsError.message;
      }
    } else if (sentVia.includes("SMS") && !phoneNumber) {
      console.warn("⚠️  SMS requested but phoneNumber not provided");
    }

    // ========== IN-APP REAL-TIME CHANNEL ==========
    if (sentVia.includes("IN_APP")) {
      try {
        const notificationPayload = {
          _id: notification._id,
          title: notification.title,
          message: notification.message,
          category: notification.category,
          type: notification.type,
          actionLink: actionLink,
          actionText: actionText,
          priority: notification.priority,
          createdAt: new Date(),
        };

        realtimeService.notifyUser(userId, notificationPayload, {
          includeHTML: true,
        });

        notification.deliveryStatus.push = {
          sent: true,
          sentAt: new Date(),
        };

        console.log(`✅ In-app notification sent to user ${userId}`);
      } catch (inAppError) {
        console.error("❌ In-app notification error:", inAppError.message);
        notification.deliveryStatus.push.error = inAppError.message;
      }
    }

    // Save notification to database
    const savedNotification = await notification.save();

    console.log(`📝 Notification created and saved: ${savedNotification._id}`);

    return {
      success: true,
      notification: savedNotification,
      message: "Notification created and sent successfully",
    };
  } catch (error) {
    console.error("❌ Error creating notification:", error.message);
    throw new Error(`Notification service error: ${error.message}`);
  }
};

/**
 * Send multiple notifications at once (batch)
 *
 * @param {Array} notificationsList - Array of notification params
 * @returns {Promise<Array>} - Array of created notifications
 */
export const createBulkNotifications = async (notificationsList) => {
  try {
    const results = [];

    for (const notifParams of notificationsList) {
      const result = await createNotificationService(notifParams);
      results.push(result);
    }

    console.log(
      `✅ Bulk notifications sent: ${results.length} notifications`
    );
    return results;
  } catch (error) {
    console.error("❌ Error in bulk notification:", error.message);
    throw error;
  }
};

/**
 * Send notification to multiple users (same content)
 *
 * @param {Array<string>} userIds - Array of user IDs
 * @param {Object} params - Notification parameters (without userId)
 * @returns {Promise<Array>} - Array of created notifications
 */
export const notifyMultipleUsers = async (userIds, params) => {
  try {
    const results = [];

    for (const userId of userIds) {
      const result = await createNotificationService({
        ...params,
        userId,
      });
      results.push(result);
    }

    console.log(`✅ Notifications sent to ${results.length} users`);
    return results;
  } catch (error) {
    console.error("❌ Error notifying multiple users:", error.message);
    throw error;
  }
};

/**
 * Retry failed notification delivery
 *
 * @param {string} notificationId - Notification ID to retry
 * @returns {Promise<Object>} - Updated notification
 */
export const retryNotificationDelivery = async (notificationId) => {
  try {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      throw new Error("Notification not found");
    }

    // Retry failed channels
    if (!notification.deliveryStatus.email.sent && notification.sentVia.includes("EMAIL")) {
      console.log("🔄 Retrying email delivery...");
      // Retry logic here
    }

    if (!notification.deliveryStatus.sms.sent && notification.sentVia.includes("SMS")) {
      console.log("🔄 Retrying SMS delivery...");
      // Retry logic here
    }

    return notification;
  } catch (error) {
    console.error("❌ Error retrying notification:", error.message);
    throw error;
  }
};

export default createNotificationService;
