import mongoose from "mongoose";
import {
  NOTIFICATION_TYPES,
  NOTIFICATION_CATEGORIES,
  PRIORITY_LEVELS,
  DELIVERY_METHODS,
} from "../constants/notifications.js";

const notificationsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    loanSchemeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LoanSchemes",
    },

    // Notification type - determines which content generator is used
    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPES),
      required: true,
    },

    // Category for filtering and organization
    category: {
      type: String,
      enum: Object.values(NOTIFICATION_CATEGORIES),
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    // UI action button
    actionable: {
      type: Boolean,
      default: false,
    },

    actionText: {
      type: String,
    },

    actionLink: {
      type: String,
    },

    // Notification delivery methods
    sentVia: {
      type: [String],
      enum: Object.values(DELIVERY_METHODS),
      default: [DELIVERY_METHODS.EMAIL],
    },

    // Notification priority level
    priority: {
      type: String,
      enum: Object.values(PRIORITY_LEVELS),
      default: PRIORITY_LEVELS.MEDIUM,
    },

    // Track delivery status
    deliveryStatus: {
      email: {
        sent: { type: Boolean, default: false },
        sentAt: Date,
        error: String,
      },
      sms: {
        sent: { type: Boolean, default: false },
        sentAt: Date,
        error: String,
      },
      push: {
        sent: { type: Boolean, default: false },
        sentAt: Date,
        error: String,
      },
    },
  },
  {
    timestamps: true,
  },
);

// Index for efficient queries
notificationsSchema.index({ userId: 1, createdAt: -1 });
notificationsSchema.index({ userId: 1, isRead: 1 });
notificationsSchema.index({ userId: 1, category: 1 });

const Notification = mongoose.model("Notification", notificationsSchema);

export default Notification;