/**
 * Notification System - Usage Guide & Examples
 * 
 * This file demonstrates how to use the improved notification system
 * with unified types, better HTML generation, and proper validation.
 */

// ============================================
// 1. USING THE NOTIFICATION SYSTEM
// ============================================

/**
 * Example 1: Creating an EMI Reminder Notification
 * POST /api/notification/create
 * 
 * Request Body:
 */
const emiReminderExample = {
  type: "EMI_REMINDER",
  data: {
    amount: 25000,
    days: 5,
  },
  sentVia: ["EMAIL", "IN_APP"],
  priority: "high",
  actionLink: "/dashboard/payments",
  actionText: "Make Payment",
};

/**
 * Example 2: Creating a Security Alert Notification
 * 
 * Request Body:
 */
const securityAlertExample = {
  type: "SECURITY_ALERT",
  data: {
    device: "Chrome on Windows",
  },
  sentVia: ["EMAIL", "PUSH_NOTIFICATION"],
  priority: "high",
  actionLink: "/settings/security",
  actionText: "Review Activity",
};

/**
 * Example 3: Creating a Rate Update Notification
 * 
 * Request Body:
 */
const rateUpdateExample = {
  type: "RATE_UPDATE",
  data: {
    bankName: "Allied Bank",
    rate: 8.5,
  },
  sentVia: ["EMAIL", "IN_APP"],
  priority: "medium",
  actionLink: "/compare?bank=allied-bank",
  actionText: "Compare Rates",
};

/**
 * Example 4: Creating a Success Notification
 * 
 * Request Body:
 */
const successExample = {
  type: "success",
  data: {
    amount: 500000,
  },
  sentVia: ["EMAIL", "IN_APP"],
  priority: "high",
};

// ============================================
// 2. CONSTANTS & TYPES REFERENCE
// ============================================

/**
 * Available Notification Types:
 * - "success" → UI Type: success (Green)
 * - "EMI_REMINDER" → UI Type: warning (Amber)
 * - "RATE_UPDATE" → UI Type: info (Blue)
 * - "SECURITY_ALERT" → UI Type: alert (Red)
 * - "info" → UI Type: info
 * - "warning" → UI Type: warning
 * - "alert" → UI Type: alert
 */

/**
 * Available Categories:
 * - "loan" - Loan-related notifications
 * - "scheme" - Loan scheme updates
 * - "payment" - Payment & EMI reminders
 * - "document" - Document requests
 * - "security" - Security alerts
 * - "message" - Messages from support
 * - "account" - Account changes
 * - "rate" - Interest rate updates
 * - "other" - Other notifications
 */

/**
 * Delivery Methods:
 * - "EMAIL" - Send via email with HTML template
 * - "SMS" - Send SMS (requires implementation)
 * - "PUSH_NOTIFICATION" - Send push notification
 * - "IN_APP" - In-app notification only
 */

/**
 * Priority Levels:
 * - "low" - Non-urgent, can wait
 * - "medium" - Standard priority
 * - "high" - Requires immediate attention
 */

// ============================================
// 3. USING HTML GENERATORS IN YOUR CODE
// ============================================

import {
  generateEmailHTML,
  generateInAppHTML,
  generatePlainTextNotification,
} from "../utils/notificationHTMLGenerator.js";

// Example: Generate email HTML
const notificationData = {
  title: "Loan Application Approved",
  message: "Your loan of PKR 500,000 has been approved!",
  category: "loan",
  uiType: "success",
};

const emailHTML = generateEmailHTML(notificationData, {
  userName: "Ahmed Hassan",
  actionLink: "https://clics.app/dashboard/loans/12345",
  actionText: "View Loan Details",
  companyName: "CLICS",
  logoUrl: "https://clics.app/logo.png",
  unsubscribeLink: "https://clics.app/unsubscribe?token=xyz",
});

// Example: Generate in-app HTML
const inAppHTML = generateInAppHTML(notificationData, {
  isDismissible: true,
  actionLink: "/dashboard/loans/12345",
  actionText: "View Details",
});

// Example: Generate plain text
const plainText = generatePlainTextNotification(notificationData);

// ============================================
// 4. WORKFLOW: PROPER TYPE USAGE
// ============================================

/**
 * Controller receives request with type
 * ↓
 * generateNotificationContent() generates title & message
 * ↓
 * getUIType() determines visual styling (color/icon)
 * ↓
 * getCategory() determines filter category
 * ↓
 * Saved to database with consistent type
 * ↓
 * generateEmailHTML() creates beautiful email
 * ↓
 * Notification sent via configured channels
 */

// ============================================
// 5. ADVANTAGES OF THIS SYSTEM
// ============================================

/**
 * ✅ Type Consistency
 * - All types defined in one place (constants/notifications.js)
 * - No more mismatches between helper and model
 * 
 * ✅ Unified Type to UI Mapping
 * - TYPE_TO_UI_TYPE maps notification types to visual styles
 * - TYPE_TO_CATEGORY maps notification types to categories
 * - Automatic and consistent
 * 
 * ✅ Beautiful Email Templates
 * - Professional HTML emails with colors and styling
 * - Responsive design
 * - Security alerts get special treatment
 * 
 * ✅ In-App Notifications
 * - Can use same data to generate in-app notifications
 * - Consistent appearance across channels
 * 
 * ✅ Extensible
 * - Easy to add new notification types
 * - Easy to customize HTML templates
 * - Easy to add new delivery methods
 * 
 * ✅ Delivery Tracking
 * - Track which delivery methods succeeded/failed
 * - Retry failed deliveries
 * - Analytics on delivery performance
 */

// ============================================
// 6. DATABASE SCHEMA IMPROVEMENTS
// ============================================

/**
 * Old Schema Issues:
 * ❌ type enum mismatch with helper
 * ❌ uiType field in controller but not in model
 * ❌ No tracking of delivery status
 * ❌ No indexes for common queries
 * 
 * New Schema Features:
 * ✅ type enum matches NOTIFICATION_TYPES constants
 * ✅ category from TYPE_TO_CATEGORY mapping
 * ✅ deliveryStatus tracks success/failure for each channel
 * ✅ Indexes on userId, createdAt, isRead, category
 * ✅ More efficient queries
 */

// ============================================
// 7. FUTURE ENHANCEMENTS
// ============================================

/**
 * Coming Soon:
 * - SMS notification templates
 * - Push notification formatting
 * - Notification preferences per user
 * - Notification batching
 * - Analytics dashboard
 * - A/B testing notification content
 * - Multi-language support
 */

export {
  emiReminderExample,
  securityAlertExample,
  rateUpdateExample,
  successExample,
};
