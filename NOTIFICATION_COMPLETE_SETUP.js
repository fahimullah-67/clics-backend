/**
 * COMPLETE NOTIFICATION SYSTEM SETUP GUIDE
 * 
 * This guide shows how to integrate the complete notification system
 * (Email, SMS, In-App Real-time) into your CLICS application.
 */

// ============================================
// STEP 1: INSTALL DEPENDENCIES
// ============================================

/**
 * Run this command in your clics-be directory:
 * 
 * npm install socket.io twilio aws-sdk @vonage/server-sdk nodemailer dotenv
 * 
 * Or install only what you need:
 * 
 * For Email (SMTP - already done):
 *   npm install nodemailer
 * 
 * For Socket.io (Real-time IN_APP):
 *   npm install socket.io
 * 
 * For SMS - Choose ONE provider:
 *   npm install twilio           # For Twilio
 *   npm install aws-sdk          # For AWS SNS (already installed?)
 *   npm install @vonage/server-sdk  # For Vonage/Nexmo
 */

// ============================================
// STEP 2: UPDATE .env FILE
// ============================================

/**
 * Add these environment variables to your .env file:
 */

const ENV_EXAMPLE = `
# ========== EMAIL (SMTP) ==========
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@clics.com

# ========== SMS PROVIDER ==========
# Choose ONE: "twilio" (default) | "aws-sns" | "vonage"
SMS_PROVIDER=twilio

# --- TWILIO SMS CONFIGURATION ---
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# --- AWS SNS SMS CONFIGURATION ---
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_SNS_SENDER_ID=CLICS

# --- VONAGE SMS CONFIGURATION ---
VONAGE_API_KEY=your_api_key
VONAGE_API_SECRET=your_api_secret
VONAGE_FROM_NAME=CLICS

# ========== SOCKET.IO ==========
SOCKET_IO_ENABLED=true
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
`;

// ============================================
// STEP 3: UPDATE YOUR MAIN APP FILE
// ============================================

/**
 * File: clics-be/index.js or app.js
 * 
 * UPDATE YOUR SERVER INITIALIZATION:
 */

const APP_EXAMPLE = `
import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import { notificationService } from "./src/utils/realTimeNotificationService.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ INITIALIZE SOCKET.IO FOR REAL-TIME NOTIFICATIONS
notificationService.initialize(httpServer, {
  cors: {
    origin: (process.env.CORS_ORIGIN || "http://localhost:5173").split(","),
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Routes
app.use("/api/notifications", notificationRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
// ... other routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(\`✅ Server running on port \${PORT}\`);
  console.log(\`📱 Socket.io enabled for real-time notifications\`);
});

export { httpServer };
`;

// ============================================
// STEP 4: EXAMPLE API REQUESTS
// ============================================

/**
 * Create Notification with ALL channels:
 * 
 * POST /api/notifications/create
 * Headers: Authorization: Bearer <token>
 * 
 * Body:
 */
const CREATE_NOTIFICATION_EXAMPLE = {
  type: "EMI_REMINDER",
  data: {
    amount: 25000,
    days: 5,
  },
  sentVia: ["EMAIL", "SMS", "IN_APP"], // All channels
  priority: "high",
  phoneNumber: "+923001234567", // Required for SMS
  actionLink: "/dashboard/payments",
  actionText: "Make Payment Now",
};

/**
 * Response:
 */
const RESPONSE_EXAMPLE = {
  statusCode: 201,
  data: {
    _id: "507f1f77bcf86cd799439011",
    userId: "507f1f77bcf86cd799439012",
    type: "EMI_REMINDER",
    title: "EMI Payment Due",
    message: "Your EMI of PKR 25,000 is due in 5 days.",
    category: "payment",
    isRead: false,
    sentVia: ["EMAIL", "SMS", "IN_APP"],
    priority: "high",
    deliveryStatus: {
      email: {
        sent: true,
        sentAt: "2026-04-26T10:30:00Z",
        error: null,
      },
      sms: {
        sent: true,
        sentAt: "2026-04-26T10:30:01Z",
        error: null,
      },
      push: {
        sent: false,
        sentAt: null,
        error: null,
      },
    },
    createdAt: "2026-04-26T10:30:00Z",
    updatedAt: "2026-04-26T10:30:00Z",
  },
  message: "Notification created",
};

// ============================================
// STEP 5: FRONTEND SETUP (React Example)
// ============================================

/**
 * File: clics-ui/CLICS/src/context/NotificationContext.jsx
 * 
 * Create a context for managing real-time notifications
 */

const FRONTEND_CONTEXT_EXAMPLE = `
import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to Socket.io server
    const newSocket = io(process.env.REACT_APP_API_URL || "http://localhost:5000", {
      auth: {
        token: localStorage.getItem("authToken"),
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Register user on connection
    newSocket.on("connect", () => {
      console.log("✅ Connected to notification server");
      const userId = localStorage.getItem("userId");
      newSocket.emit("register_user", userId);
      setIsConnected(true);
    });

    // Listen for new notifications
    newSocket.on("new_notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      
      // Show toast notification
      showNotificationToast(notification);
    });

    // Listen for notification updates
    newSocket.on("notification_update", (data) => {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === data.notificationId ? { ...n, ...data.updates } : n
        )
      );
    });

    // Connection status
    newSocket.on("connection_status", (status) => {
      console.log("Connection status:", status);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from notification server");
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const dismissNotification = (notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isConnected,
        markAsRead,
        dismissNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}

function showNotificationToast(notification) {
  // Use your UI library (toast, snackbar, etc.)
  console.log("🔔 New notification:", notification.title);
  // Example with react-toastify:
  // toast[notification.type || 'info'](notification.message);
}
`;

/**
 * File: clics-ui/CLICS/src/components/NotificationBell.jsx
 * 
 * Component to display notification bell with unread count
 */

const FRONTEND_COMPONENT_EXAMPLE = `
import { useNotifications } from "../context/NotificationContext";
import { Bell } from "lucide-react";

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-sm flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No notifications
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className="p-4 border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => markAsRead(notif.id)}
              >
                <h4 className="font-semibold">{notif.title}</h4>
                <p className="text-sm text-gray-600">{notif.message}</p>
                <span className="text-xs text-gray-400">
                  {new Date(notif.createdAt).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
`;

// ============================================
// STEP 6: SMS PROVIDER SETUP INSTRUCTIONS
// ============================================

const SMS_SETUP = `
## SMS Provider Setup

### Option 1: TWILIO (Recommended for testing)

1. Sign up at https://www.twilio.com
2. Get your credentials from Dashboard:
   - Account SID
   - Auth Token
   - Phone Number (provided by Twilio)
3. Add to .env:
   SMS_PROVIDER=twilio
   TWILIO_ACCOUNT_SID=ACxxxxx
   TWILIO_AUTH_TOKEN=xxxxx
   TWILIO_PHONE_NUMBER=+1234567890

### Option 2: AWS SNS

1. Create IAM user with SNS permissions
2. Get credentials:
   - Access Key ID
   - Secret Access Key
3. Add to .env:
   SMS_PROVIDER=aws-sns
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=xxxxx
   AWS_SECRET_ACCESS_KEY=xxxxx

### Option 3: VONAGE (Nexmo)

1. Sign up at https://www.vonage.com
2. Get credentials from API Dashboard:
   - API Key
   - API Secret
3. Add to .env:
   SMS_PROVIDER=vonage
   VONAGE_API_KEY=xxxxx
   VONAGE_API_SECRET=xxxxx
`;

// ============================================
// STEP 7: TESTING THE SYSTEM
// ============================================

const TESTING_GUIDE = `
## Testing the Notification System

### 1. Test Email Notification
POST /api/notifications/create
Body:
{
  "type": "EMI_REMINDER",
  "data": { "amount": 25000, "days": 5 },
  "sentVia": ["EMAIL"],
  "actionLink": "/dashboard/payments"
}

Check: Email inbox should receive HTML email

### 2. Test SMS Notification
POST /api/notifications/create
Body:
{
  "type": "SECURITY_ALERT",
  "data": { "device": "Chrome on Windows" },
  "sentVia": ["SMS"],
  "phoneNumber": "+923001234567"
}

Check: Phone should receive SMS

### 3. Test In-App Real-time Notification
1. Open browser console
2. Create notification via API with "IN_APP" in sentVia
3. Check frontend - notification should appear in real-time
4. Check browser console for Socket.io messages

### 4. Test All Channels Together
POST /api/notifications/create
Body:
{
  "type": "success",
  "data": { "amount": 500000 },
  "sentVia": ["EMAIL", "SMS", "IN_APP"],
  "phoneNumber": "+923001234567",
  "priority": "high"
}

Check all three channels for delivery
`;

// ============================================
// SUMMARY OF CHANGES
// ============================================

const SUMMARY = `
## Files Created/Modified

✅ NEW FILES:
- src/utils/notificationSMSSender.js - SMS utilities (Twilio, AWS SNS, Vonage)
- src/utils/realTimeNotificationService.js - Socket.io integration for real-time notifications
- NOTIFICATION_COMPLETE_SETUP.js - This guide

✅ MODIFIED FILES:
- src/controllers/notification.controller.js - Added SMS and IN_APP handling
- src/utils/notificationHTMLGenerator.js - Already created
- src/utils/notificationHelper.js - Already created
- src/models/notifications.model.js - Already updated
- src/constants/notifications.js - Already created

## What You Get

1. 📧 **Professional Email Notifications**
   - Beautiful HTML templates
   - SMTP support
   - Color-coded by type
   - Delivery tracking

2. 💬 **SMS Notifications**
   - Multiple providers (Twilio, AWS SNS, Vonage)
   - Character limit handling
   - Delivery tracking

3. 🔔 **Real-time In-App Notifications**
   - WebSocket using Socket.io
   - Live updates without refresh
   - Delivery to connected users
   - Typing indicators, broadcast support

4. 📊 **Delivery Status Tracking**
   - Know what succeeded/failed
   - Retry capabilities
   - Analytics ready

## Next Steps

1. Install dependencies
2. Update .env with email/SMS credentials
3. Update index.js to initialize Socket.io
4. Create NotificationContext in frontend
5. Test each channel
6. Deploy!
`;

export {
  ENV_EXAMPLE,
  APP_EXAMPLE,
  CREATE_NOTIFICATION_EXAMPLE,
  FRONTEND_CONTEXT_EXAMPLE,
  FRONTEND_COMPONENT_EXAMPLE,
  SMS_SETUP,
  TESTING_GUIDE,
  SUMMARY,
};
