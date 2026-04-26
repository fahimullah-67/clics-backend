// /**
//  * Real-time Notification Service using Socket.io
//  * 
//  * Setup Instructions:
//  * 1. Install socket.io: npm install socket.io
//  * 2. Initialize in your main app file (see example at bottom)
//  * 3. Import and use the notification service in your controllers
//  * 
//  * Environment Variables:
//  * - SOCKET_IO_ENABLED: true/false (default: true in production)
//  */

// import { generateInAppHTML } from "./notificationHTMLGenerator.js";

// class RealTimeNotificationService {
//   constructor() {
//     this.io = null;
//     this.userSockets = new Map(); // Map of userId -> Set of socket IDs
//   }

//   /**
//    * Initialize Socket.io with the express server
//    * Call this once when starting your server
//    */
//   initialize(server, options = {}) {
//     const socketIO = require("socket.io");

//     this.io = new socketIO(server, {
//       cors: {
//         origin: process.env.CORS_ORIGIN || "*",
//         methods: ["GET", "POST"],
//         credentials: true,
//       },
//       ...options,
//     });

//     this.setupEventHandlers();

//     console.log("✅ Socket.io initialized for real-time notifications");
//     return this.io;
//   }

//   /**
//    * Setup Socket.io event handlers
//    */
//   setupEventHandlers() {
//     this.io.on("connection", (socket) => {
//       console.log(` User connected: ${socket.id}`);

//       // User authenticates and registers their socket
//       socket.on("register_user", (userId) => {
//         if (!this.userSockets.has(userId)) {
//           this.userSockets.set(userId, new Set());
//         }
//         this.userSockets.get(userId).add(socket.id);

//         socket.join(`user_${userId}`); // Join a room for this user
//         console.log(` User ${userId} registered with socket ${socket.id}`);

//         // Notify user that they're connected
//         socket.emit("connection_status", {
//           connected: true,
//           socketId: socket.id,
//         });
//       });

//       // Handle disconnection
//       socket.on("disconnect", () => {
//         console.log(` Socket disconnected: ${socket.id}`);

//         // Remove socket from userSockets map
//         for (const [userId, sockets] of this.userSockets.entries()) {
//           if (sockets.has(socket.id)) {
//             sockets.delete(socket.id);
//             if (sockets.size === 0) {
//               this.userSockets.delete(userId);
//             }
//           }
//         }
//       });

//       // Test/ping event
//       socket.on("ping", () => {
//         socket.emit("pong", { timestamp: new Date() });
//       });
//     });
//   }

//   /**
//    * Send real-time notification to specific user
//    * @param {string} userId - Target user ID
//    * @param {Object} notification - Notification object with title, message, etc.
//    * @param {Object} options - Additional options for Socket.io
//    */
//   notifyUser(userId, notification, options = {}) {
//     if (!this.io) {
//       console.warn("Socket.io not initialized");
//       return false;
//     }

//     const notificationPayload = {
//       id: notification._id?.toString() || Date.now(),
//       title: notification.title,
//       message: notification.message,
//       category: notification.category,
//       type: notification.type,
//       isRead: notification.isRead || false,
//       createdAt: notification.createdAt || new Date(),
//       actionLink: notification.actionLink || null,
//       actionText: notification.actionText || "View",
//       priority: notification.priority || "medium",
//     };

//     // Send to all sockets of this user
//     this.io.to(`user_${userId}`).emit("new_notification", {
//       ...notificationPayload,
//       html: options.includeHTML
//         ? generateInAppHTML(notification, { isDismissible: true })
//         : null,
//     });

//     console.log(`📨 Notification sent to user ${userId}:`, notification.title);
//     return true;
//   }

//   /**
//    * Send notification to multiple users (broadcast)
//    * @param {Array<string>} userIds - Array of user IDs
//    * @param {Object} notification - Notification object
//    */
//   notifyUsers(userIds, notification, options = {}) {
//     userIds.forEach((userId) => {
//       this.notifyUser(userId, notification, options);
//     });
//   }

//   /**
//    * Broadcast notification to all connected users
//    * (Use carefully - usually for system-wide announcements)
//    */
//   broadcastNotification(notification, options = {}) {
//     if (!this.io) {
//       console.warn("Socket.io not initialized");
//       return false;
//     }

//     this.io.emit("broadcast_notification", {
//       title: notification.title,
//       message: notification.message,
//       category: notification.category,
//       type: notification.type,
//       priority: notification.priority || "medium",
//       html: options.includeHTML
//         ? generateInAppHTML(notification, { isDismissible: true })
//         : null,
//     });

//     console.log("📡 Broadcast notification sent");
//     return true;
//   }

//   /**
//    * Update notification status (e.g., mark as read)
//    * @param {string} userId - User ID
//    * @param {string} notificationId - Notification ID
//    * @param {Object} updates - Fields to update {isRead, ...}
//    */
//   updateNotificationStatus(userId, notificationId, updates) {
//     if (!this.io) return false;

//     this.io.to(`user_${userId}`).emit("notification_update", {
//       notificationId: notificationId,
//       updates: updates,
//     });

//     return true;
//   }

//   /**
//    * Send typing indicator (for chat-like notifications)
//    */
//   sendTypingIndicator(userId, isTyping) {
//     if (!this.io) return false;

//     this.io.to(`user_${userId}`).emit("typing_indicator", {
//       isTyping: isTyping,
//       timestamp: new Date(),
//     });

//     return true;
//   }

//   /**
//    * Get number of connected users
//    */
//   getConnectedUsersCount() {
//     return this.userSockets.size;
//   }

//   /**
//    * Get connection status for a user
//    */
//   getUserConnectionStatus(userId) {
//     const sockets = this.userSockets.get(userId);
//     return {
//       isConnected: sockets && sockets.size > 0,
//       socketCount: sockets ? sockets.size : 0,
//       socketIds: sockets ? Array.from(sockets) : [],
//     };
//   }
// }

// // Export singleton instance
// export const notificationService = new RealTimeNotificationService();

// /**
//  * EXAMPLE SETUP IN YOUR MAIN APP FILE (app.js or index.js):
//  * 
//  * import express from "express";
//  * import { createServer } from "http";
//  * import { notificationService } from "./src/utils/realTimeNotificationService.js";
//  * 
//  * const app = express();
//  * const httpServer = createServer(app);
//  * 
//  * // Initialize Socket.io
//  * notificationService.initialize(httpServer, {
//  *   cors: {
//  *     origin: ["http://localhost:5173", "http://localhost:3000"],
//  *     credentials: true,
//  *   },
//  * });
//  * 
//  * // Start server
//  * const PORT = process.env.PORT || 5000;
//  * httpServer.listen(PORT, () => {
//  *   console.log(`Server running on port ${PORT}`);
//  * });
//  * 
//  * export { httpServer };
//  */

// /**
//  * EXAMPLE USAGE IN CONTROLLER:
//  * 
//  * import { notificationService } from "../utils/realTimeNotificationService.js";
//  * 
//  * // In your createNotification controller:
//  * if (notification.sentVia.includes("IN_APP")) {
//  *   notificationService.notifyUser(userid, savedNotification, {
//  *     includeHTML: true,
//  *   });
//  * }
//  */

// /**
//  * EXAMPLE FRONTEND (React/Vue) USAGE:
//  * 
//  * import { useEffect, useState } from "react";
//  * import io from "socket.io-client";
//  * 
//  * function NotificationComponent() {
//  *   const [notifications, setNotifications] = useState([]);
//  * 
//  *   useEffect(() => {
//  *     // Connect to Socket.io server
//  *     const socket = io("http://localhost:5000", {
//  *       auth: {
//  *         token: localStorage.getItem("authToken"),
//  *       },
//  *     });
//  * 
//  *     // Register user on connection
//  *     socket.on("connect", () => {
//  *       const userId = localStorage.getItem("userId");
//  *       socket.emit("register_user", userId);
//  *     });
//  * 
//  *     // Listen for new notifications
//  *     socket.on("new_notification", (notification) => {
//  *       setNotifications((prev) => [notification, ...prev]);
//  *       // Show toast/banner
//  *       showNotificationUI(notification);
//  *     });
//  * 
//  *     // Listen for notification updates
//  *     socket.on("notification_update", (data) => {
//  *       setNotifications((prev) =>
//  *         prev.map((n) =>
//  *           n.id === data.notificationId ? { ...n, ...data.updates } : n
//  *         )
//  *       );
//  *     });
//  * 
//  *     return () => socket.disconnect();
//  *   }, []);
//  * 
//  *   return (
//  *     <div className="notifications">
//  *       {notifications.map((notif) => (
//  *         <NotificationCard key={notif.id} notification={notif} />
//  *       ))}
//  *     </div>
//  *   );
//  * }
//  */

// export default notificationService;
