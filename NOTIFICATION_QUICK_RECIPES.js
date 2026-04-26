/**
 * NOTIFICATION SERVICE - QUICK START GUIDE
 * 
 * Copy-paste ready examples for common use cases
 */

// ============================================
// SETUP (One-time)
// ============================================

/**
 * 1. In your main app file (index.js):
 */

import { createServer } from "http";
import { notificationService } from "./src/utils/realTimeNotificationService.js";

const httpServer = createServer(app);

// Initialize Socket.io
notificationService.initialize(httpServer);

httpServer.listen(5000);

/**
 * 2. Install dependencies:
 *    npm install socket.io twilio
 * 
 * 3. Update .env with email/SMS credentials
 */

// ============================================
// QUICK RECIPES
// ============================================

import { createNotificationService } from "../services/notificationService.js";
import { NOTIFICATION_TYPES } from "../constants/notifications.js";

// === RECIPE 1: WELCOME EMAIL ON SIGNUP ===
await createNotificationService({
  userId: newUser._id,
  email: newUser.email,
  type: NOTIFICATION_TYPES.WELCOME,
  data: { userName: newUser.username },
  sentVia: ["EMAIL", "IN_APP"],
  priority: "high",
  actionLink: "/dashboard",
  actionText: "Go to Dashboard",
  userName: newUser.username,
});

// === RECIPE 2: LOGIN SECURITY ALERT ===
await createNotificationService({
  userId: user._id,
  email: user.email,
  type: NOTIFICATION_TYPES.LOGIN_ALERT,
  data: { device: req.headers["user-agent"] },
  sentVia: ["EMAIL", "IN_APP"],
  priority: "high",
  userName: user.username,
});

// === RECIPE 3: LOAN APPROVAL NOTIFICATION ===
await createNotificationService({
  userId: userId,
  email: userEmail,
  phoneNumber: userPhone,
  type: NOTIFICATION_TYPES.SUCCESS,
  data: { amount: loanAmount },
  sentVia: ["EMAIL", "SMS", "IN_APP"],
  priority: "high",
  actionLink: `/loans/${loanId}`,
  actionText: "View Loan",
  userName: userName,
});

// === RECIPE 4: EMI PAYMENT REMINDER ===
await createNotificationService({
  userId: userId,
  email: userEmail,
  phoneNumber: userPhone,
  type: NOTIFICATION_TYPES.EMI_REMINDER,
  data: {
    amount: 25000,
    days: 5,
  },
  sentVia: ["EMAIL", "SMS", "IN_APP"],
  priority: "high",
  actionLink: `/loans/${loanId}/pay`,
  actionText: "Pay Now",
  userName: userName,
});

// === RECIPE 5: INTEREST RATE UPDATE ===
await createNotificationService({
  userId: userId,
  email: userEmail,
  type: NOTIFICATION_TYPES.RATE_UPDATE,
  data: {
    bankName: "Allied Bank",
    rate: 8.5,
  },
  sentVia: ["EMAIL", "IN_APP"],
  priority: "medium",
  actionLink: "/compare-rates",
  actionText: "Compare Rates",
  userName: userName,
});

// === RECIPE 6: SECURITY ALERT ===
await createNotificationService({
  userId: userId,
  email: userEmail,
  type: NOTIFICATION_TYPES.SECURITY_ALERT,
  data: { device: "Chrome on Windows" },
  sentVia: ["EMAIL", "IN_APP"],
  priority: "high",
  actionLink: "/settings/security",
  actionText: "Review Activity",
  userName: userName,
});

// === RECIPE 7: NOTIFY MULTIPLE USERS ===
import { notifyMultipleUsers } from "../services/notificationService.js";

const userIds = ["id1", "id2", "id3"];
await notifyMultipleUsers(userIds, {
  email: "system@clics.com", // Template
  type: NOTIFICATION_TYPES.RATE_UPDATE,
  data: { bankName: "Allied", rate: 8.5 },
  sentVia: ["EMAIL"],
  priority: "medium",
});

// === RECIPE 8: ERROR HANDLING (SAFE) ===
try {
  await createNotificationService({
    userId,
    email,
    type: NOTIFICATION_TYPES.WELCOME,
    data: { userName },
    sentVia: ["EMAIL", "IN_APP"],
    userName,
  });
} catch (error) {
  console.error("Notification error (non-critical):", error.message);
  // Don't crash - notification is async
}

// === RECIPE 9: WITH CUSTOM EMAIL OPTIONS ===
await createNotificationService({
  userId,
  email,
  type: NOTIFICATION_TYPES.SUCCESS,
  data: { amount: 50000 },
  sentVia: ["EMAIL"],
  priority: "high",
  options: {
    emailOptions: {
      companyName: "CLICS Finance",
      logoUrl: "https://clics.com/logo.png",
      unsubscribeLink: "https://clics.com/unsubscribe",
    },
  },
  userName,
});

// === RECIPE 10: SMS ONLY NOTIFICATION ===
await createNotificationService({
  userId,
  phoneNumber: "+923001234567",
  type: NOTIFICATION_TYPES.EMI_REMINDER,
  data: { amount: 25000, days: 5 },
  sentVia: ["SMS"],
  priority: "high",
  userName,
});

// ============================================
// INTEGRATION IN YOUR WORKFLOWS
// ============================================

// In registerUser()
const registerUser = async (req, res) => {
  // ... create user ...
  await createNotificationService({
    userId: newUser._id,
    email: newUser.email,
    type: NOTIFICATION_TYPES.WELCOME,
    data: { userName: newUser.username },
    sentVia: ["EMAIL", "IN_APP"],
    userName: newUser.username,
  }).catch((e) => console.error("Notif error:", e));
  // ... continue ...
};

// In loginUser()
const loginUser = async (req, res) => {
  // ... verify password ...
  await createNotificationService({
    userId: user._id,
    email: user.email,
    type: NOTIFICATION_TYPES.LOGIN_ALERT,
    data: { device: req.headers["user-agent"] },
    sentVia: ["EMAIL", "IN_APP"],
    userName: user.username,
  }).catch((e) => console.error("Notif error:", e));
  // ... continue ...
};

// In approveLoan()
const approveLoan = async (req, res) => {
  // ... approve loan ...
  await createNotificationService({
    userId: loan.userId,
    email: user.email,
    phoneNumber: user.phoneNumber,
    type: NOTIFICATION_TYPES.SUCCESS,
    data: { amount: loan.amount },
    sentVia: ["EMAIL", "SMS", "IN_APP"],
    priority: "high",
    actionLink: `/loans/${loan._id}`,
    actionText: "View Loan",
    userName: user.username,
  }).catch((e) => console.error("Notif error:", e));
  // ... continue ...
};

// In scheduled task (Cron job)
const sendEMIReminders = async () => {
  const dueLoanss = await Loan.find({
    nextEMIDate: { $lte: new Date() },
  }).populate("userId");

  for (const loan of dueLoans) {
    await createNotificationService({
      userId: loan.userId._id,
      email: loan.userId.email,
      phoneNumber: loan.userId.phoneNumber,
      type: NOTIFICATION_TYPES.EMI_REMINDER,
      data: { amount: loan.emiAmount, days: 5 },
      sentVia: ["EMAIL", "SMS", "IN_APP"],
      priority: "high",
      userName: loan.userId.username,
    }).catch((e) => console.error("Notif error:", e));
  }
};

// ============================================
// TROUBLESHOOTING
// ============================================

/**
 * Email not sending?
 * - Check .env EMAIL_USER, EMAIL_PASSWORD
 * - Verify SMTP credentials
 * - Check email delivery status in database
 * 
 * SMS not sending?
 * - Verify phone number format (+92...)
 * - Check Twilio/AWS credentials
 * - Ensure SMS_PROVIDER is set in .env
 * 
 * In-app not showing?
 * - Verify Socket.io is initialized
 * - Check browser console for connection errors
 * - Ensure user is registered with their userId
 * 
 * Data not saved?
 * - Check MongoDB connection
 * - Verify userId exists
 * - Check notification model schema
 */

// ============================================
// CHECKING DELIVERY STATUS
// ============================================

/**
 * Query notification delivery status:
 */

import Notification from "../models/notifications.model.js";

// Find failed emails
const failedEmails = await Notification.find({
  "deliveryStatus.email.sent": false,
});

// Find successful SMS
const successSMS = await Notification.find({
  "deliveryStatus.sms.sent": true,
});

// Find all for user
const userNotifs = await Notification.find({
  userId: userId,
}).sort({ createdAt: -1 });

// Get delivery stats
const stats = await Notification.aggregate([
  {
    $group: {
      _id: null,
      emailSent: {
        $sum: { $cond: ["$deliveryStatus.email.sent", 1, 0] },
      },
      smsSent: {
        $sum: { $cond: ["$deliveryStatus.sms.sent", 1, 0] },
      },
      total: { $sum: 1 },
    },
  },
]);

// ============================================
// NEXT STEPS
// ============================================

/**
 * 1. Copy a recipe from above
 * 2. Paste into your controller
 * 3. Update with your data
 * 4. Test it
 * 5. Check email inbox + database
 * 6. Done!
 * 
 * For more examples, see:
 * - NOTIFICATION_SERVICE_USAGE.js
 * - src/controllers/user.controller.js (working examples)
 * - src/controllers/notification.controller.js (detailed)
 */
