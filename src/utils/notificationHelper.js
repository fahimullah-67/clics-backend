import {
  NOTIFICATION_TYPES,
  TYPE_TO_UI_TYPE,
  TYPE_TO_CATEGORY,
} from "../constants/notifications.js";

export const generateNotificationContent = (type, data) => {
  switch (type) {
    case NOTIFICATION_TYPES.WELCOME:
      return {
        title: "Welcome to CLICS System! 🎉",
        message:
          data?.message ||
          `Hi ${data?.userName || "User"}, welcome to CLICS System! We're excited to have you on board. Explore your dashboard and manage your account with ease.`,
        category: "account",
        uiType: "success",
      };

    case NOTIFICATION_TYPES.LOGIN_ALERT:
      return {
        title: "Login Alert 🚨",
        message: `You just logged in from ${data?.device || "a new device"}. If this wasn't you, please secure your account immediately.`,
        category: "security",
        uiType: "alert",
      };

    case NOTIFICATION_TYPES.SUCCESS:
      return {
        title: "Loan Application Approved",
        message: `Your loan of PKR ${data.amount} has been approved.`,
        category: "loan",
        uiType: "success",
      };

    case NOTIFICATION_TYPES.EMI_REMINDER:
      return {
        title: "EMI Payment Due",
        message: `Your EMI of PKR ${data.amount} is due in ${data.days} days.`,
        category: "payment",
        uiType: "warning",
      };

    case NOTIFICATION_TYPES.RATE_UPDATE:
      return {
        title: "Interest Rate Update",
        message: `${data.bankName} updated interest rate to ${data.rate}%.`,
        category: "rate",
        uiType: "info",
      };

    case NOTIFICATION_TYPES.SECURITY_ALERT:
      return {
        title: "Security Alert",
        message: `New login detected from ${data.device}.`,
        category: "security",
        uiType: "alert",
      };
    
    case NOTIFICATION_TYPES.INFO:
      return {
        title: "Information",
        message: data?.message || "You have a new notification.",
        category: "other",
        uiType: "info",
      };

    default:
      return {
        title: "Notification",
        message: data?.message || "You have a new notification.",
        category: "other",
        uiType: "info",
      };
  }
};

// Get UI type from notification type
export const getUIType = (type) => {
  return TYPE_TO_UI_TYPE[type] || "info";
};

// Get category from notification type
export const getCategory = (type) => {
  return TYPE_TO_CATEGORY[type] || "other";
};