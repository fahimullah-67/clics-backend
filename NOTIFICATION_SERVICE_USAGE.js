/**
 * USING NOTIFICATION SERVICE IN YOUR CONTROLLERS & SERVICES
 * 
 * The notification service can be called from ANY module, not just HTTP controllers.
 * Perfect for signup, login, scheduled tasks, and any business logic.
 */

// ============================================
// EXAMPLE 1: IN USER CONTROLLER (SIGNUP)
// ============================================

/**
 * File: src/controllers/user.controller.js
 * 
 * Import:
 */

import { createNotificationService } from "../services/notificationService.js";
import { NOTIFICATION_TYPES } from "../constants/notifications.js";

/**
 * Usage in registerUser:
 */

export const registerUser_EXAMPLE = async (req, res) => {
  // ... user creation code ...

  const userId = newUser._id;
  const userEmail = newUser.email;
  const userName = newUser.username;

  // ✅ Call notification service directly
  try {
    await createNotificationService({
      userId: userId,
      email: userEmail,
      type: NOTIFICATION_TYPES.WELCOME,
      data: {
        userName: userName,
      },
      sentVia: ["EMAIL", "IN_APP"], // Send via both channels
      priority: "high",
      actionLink: "/dashboard",
      actionText: "Go to Dashboard",
      userName: userName,
    });
  } catch (notifError) {
    console.error("Notification error:", notifError.message);
    // Don't fail the signup if notification fails
  }

  res.status(201).json({ message: "User registered" });
};

// ============================================
// EXAMPLE 2: IN LOGIN CONTROLLER
// ============================================

export const loginUser_EXAMPLE = async (req, res) => {
  // ... login logic ...

  // ✅ Send login alert notification
  try {
    await createNotificationService({
      userId: user._id,
      email: user.email,
      type: NOTIFICATION_TYPES.LOGIN_ALERT,
      data: {
        device: req.headers["user-agent"] || "Unknown Device",
      },
      sentVia: ["EMAIL", "IN_APP"],
      priority: "high",
      actionLink: "/settings/security",
      actionText: "Review Security",
      userName: user.username,
    });
  } catch (notifError) {
    console.error("Notification error:", notifError.message);
  }

  res.status(200).json({ message: "Login successful" });
};

// ============================================
// EXAMPLE 3: IN LOAN CONTROLLER
// ============================================

/**
 * Send notification when loan is approved
 */

export const approveLoan_EXAMPLE = async (req, res) => {
  const { loanId, userId, loanAmount } = req.body;

  // ... approval logic ...

  try {
    await createNotificationService({
      userId: userId,
      email: user.email,
      type: NOTIFICATION_TYPES.SUCCESS,
      data: {
        amount: loanAmount,
      },
      sentVia: ["EMAIL", "SMS", "IN_APP"],
      phoneNumber: user.phoneNumber, // Required for SMS
      priority: "high",
      actionLink: `/loans/${loanId}`,
      actionText: "View Loan Details",
      userName: user.username,
    });
  } catch (error) {
    console.error("Notification error:", error);
  }

  res.status(200).json({ message: "Loan approved" });
};

// ============================================
// EXAMPLE 4: IN SCHEDULED TASK / CRON JOB
// ============================================

/**
 * File: src/services/loanReminderService.js
 * 
 * Send EMI reminders to all users with upcoming payments
 */

import { createNotificationService } from "./notificationService.js";
import Loan from "../models/Loan.model.js";

export const sendEMIReminders = async () => {
  try {
    // Find all loans with EMI due in next 5 days
    const dueLoans = await Loan.find({
      nextEMIDate: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
    }).populate("userId");

    // Send notification to each user
    for (const loan of dueLoans) {
      await createNotificationService({
        userId: loan.userId._id,
        email: loan.userId.email,
        phoneNumber: loan.userId.phoneNumber,
        type: NOTIFICATION_TYPES.EMI_REMINDER,
        data: {
          amount: loan.emiAmount,
          days: Math.ceil(
            (new Date(loan.nextEMIDate) - new Date()) / (1000 * 60 * 60 * 24)
          ),
        },
        sentVia: ["EMAIL", "SMS", "IN_APP"],
        priority: "high",
        actionLink: `/loans/${loan._id}/pay`,
        actionText: "Pay EMI",
        userName: loan.userId.username,
      });
    }

    console.log(`✅ EMI reminders sent to ${dueLoans.length} users`);
  } catch (error) {
    console.error("Error sending EMI reminders:", error);
  }
};

// ============================================
// EXAMPLE 5: SEND TO MULTIPLE USERS
// ============================================

import {
  createNotificationService,
  notifyMultipleUsers,
} from "../services/notificationService.js";

export const notifyAllUsersAboutRateChange = async () => {
  try {
    const userIds = ["userId1", "userId2", "userId3"];

    await notifyMultipleUsers(userIds, {
      email: "user@clics.com", // This will be overridden for each user
      type: NOTIFICATION_TYPES.RATE_UPDATE,
      data: {
        bankName: "Allied Bank",
        rate: 8.5,
      },
      sentVia: ["EMAIL", "IN_APP"],
      priority: "medium",
      actionLink: "/compare-rates",
      actionText: "Compare Rates",
    });

    console.log(`✅ Rate update notifications sent to ${userIds.length} users`);
  } catch (error) {
    console.error("Error:", error);
  }
};

// ============================================
// EXAMPLE 6: IN UTILITY/HELPER FUNCTION
// ============================================

/**
 * File: src/utils/transactionHelper.js
 */

export const processLoanApplication = async (applicationData) => {
  try {
    // Process application...
    const isApproved = Math.random() > 0.5;

    if (isApproved) {
      // Notify user of approval
      await createNotificationService({
        userId: applicationData.userId,
        email: applicationData.email,
        type: NOTIFICATION_TYPES.SUCCESS,
        data: {
          amount: applicationData.loanAmount,
        },
        sentVia: ["EMAIL", "SMS", "IN_APP"],
        phoneNumber: applicationData.phoneNumber,
        priority: "high",
        actionLink: `/dashboard/loans`,
        actionText: "View Loan",
        userName: applicationData.userName,
      });
    }

    return isApproved;
  } catch (error) {
    console.error("Error processing application:", error);
    throw error;
  }
};

// ============================================
// AVAILABLE NOTIFICATION TYPES
// ============================================

/**
 * NOTIFICATION_TYPES in src/constants/notifications.js:
 * 
 * - SUCCESS         → Loan approved, transaction success
 * - WELCOME         → User registration/welcome
 * - LOGIN_ALERT     → New login detected
 * - EMI_REMINDER    → Payment reminder
 * - RATE_UPDATE     → Interest rate changed
 * - SECURITY_ALERT  → Suspicious activity
 * - INFO            → General info
 * - WARNING         → Warning message
 * - ALERT           → Alert/urgent
 */

// ============================================
// NOTIFICATION SERVICE PARAMETERS
// ============================================

/**
 * Full parameter object for createNotificationService:
 * 
 * {
 *   // REQUIRED
 *   userId: "user_id_string",      // MongoDB user ID
 *   type: NOTIFICATION_TYPES.SUCCESS, // Type constant
 *   data: { },                     // Data for content generation
 * 
 *   // OPTIONAL BUT RECOMMENDED
 *   email: "user@example.com",     // For EMAIL channel
 *   phoneNumber: "+923001234567",  // For SMS channel
 *   userName: "Ahmed",             // Display name
 *   sentVia: ["EMAIL", "SMS", "IN_APP"], // Channels to use
 *   priority: "high",              // low, medium, high
 * 
 *   // OPTIONAL - ACTION BUTTON
 *   actionLink: "/dashboard",      // URL to navigate to
 *   actionText: "Go to Dashboard", // Button text
 * 
 *   // OPTIONAL - EMAIL CUSTOMIZATION
 *   options: {
 *     emailOptions: {
 *       companyName: "CLICS",
 *       logoUrl: "https://...",
 *       unsubscribeLink: "https://..."
 *     }
 *   }
 * }
 */

// ============================================
// ERROR HANDLING
// ============================================

/**
 * Always wrap in try-catch because:
 * - Email might fail (SMTP server down)
 * - SMS might fail (invalid phone number)
 * - WebSocket might not be connected
 * 
 * BUT: The notification is still saved to database
 * and you can retry failed deliveries later
 */

export const safeSendNotification = async (params) => {
  try {
    const result = await createNotificationService(params);
    console.log("✅ Notification sent successfully");
    return result;
  } catch (error) {
    // Log error but don't crash your business logic
    console.error("⚠️  Notification error (non-critical):", error.message);

    // The user won't see this error - notification is asynchronous
    // Check database for delivery status later
    return null;
  }
};

// ============================================
// TESTING THE SERVICE
// ============================================

/**
 * Test from any controller:
 */

export const testNotificationService = async (req, res) => {
  try {
    const result = await createNotificationService({
      userId: req.user.userid,
      email: req.user.email,
      type: NOTIFICATION_TYPES.SUCCESS,
      data: {
        amount: 50000,
      },
      sentVia: ["EMAIL", "IN_APP"],
      priority: "high",
      userName: req.user.username,
    });

    res.status(200).json({
      message: "Test notification sent",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Test failed",
      error: error.message,
    });
  }
};

// ============================================
// DELIVERY STATUS TRACKING
// ============================================

/**
 * The notification service automatically tracks:
 * 
 * notification.deliveryStatus = {
 *   email: {
 *     sent: true/false,
 *     sentAt: Date,
 *     error: "error message" | null
 *   },
 *   sms: {
 *     sent: true/false,
 *     sentAt: Date,
 *     error: "error message" | null
 *   },
 *   push: {
 *     sent: true/false,
 *     sentAt: Date,
 *     error: "error message" | null
 *   }
 * }
 * 
 * Use this to:
 * - Monitor delivery performance
 * - Identify failed notifications
 * - Retry failed deliveries
 * - Generate analytics reports
 */

// ============================================
// BEST PRACTICES
// ============================================

/**
 * 1. ALWAYS wrap in try-catch
 *    - Notifications are non-critical
 *    - Don't let them crash your app
 * 
 * 2. USE proper error logging
 *    - Log to console or error service
 *    - Track delivery failures
 * 
 * 3. PROVIDE user-friendly data
 *    - Meaningful titles and messages
 *    - Relevant action links
 *    - Clear call-to-action buttons
 * 
 * 4. TEST each notification type
 *    - Verify email format
 *    - Check SMS character limits
 *    - Confirm in-app display
 * 
 * 5. MONITOR delivery status
 *    - Check database for failures
 *    - Set up alerts for critical notifications
 *    - Implement retry logic
 */

export { createNotificationService, notifyMultipleUsers };
