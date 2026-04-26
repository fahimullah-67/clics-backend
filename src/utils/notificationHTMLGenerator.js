/**
 * Generate HTML notification templates for emails and UI display
 * Supports multiple notification types with styled HTML
 */

const getColorByUIType = (uiType) => {
  const colors = {
    success: "#10b981", // Green
    info: "#3b82f6", // Blue
    warning: "#f59e0b", // Amber
    alert: "#ef4444", // Red
  };
  return colors[uiType] || colors.info;
};

const getBadgeStyle = (uiType) => {
  const styles = {
    success: "background-color: #d1fae5; color: #065f46;",
    info: "background-color: #dbeafe; color: #0c2d6b;",
    warning: "background-color: #fef3c7; color: #78350f;",
    alert: "background-color: #fee2e2; color: #7f1d1d;",
  };
  return styles[uiType] || styles.info;
};

/**
 * Generate HTML email template for notification
 * @param {Object} notification - Notification object with title, message, uiType, category
 * @param {Object} options - Configuration options
 * @returns {string} HTML email template
 */
export const generateEmailHTML = (notification, options = {}) => {
  const {
    userName = "User",
    actionLink = null,
    actionText = "View Details",
    companyName = "CLICS",
    logoUrl = null,
    unsubscribeLink = null,
  } = options;

  const primaryColor = getColorByUIType(notification.uiType);
  const badgeStyle = getBadgeStyle(notification.uiType);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${notification.title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f3f4f6;
            color: #374151;
            line-height: 1.5;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .header-subtitle {
            font-size: 14px;
            opacity: 0.9;
        }
        .badge {
            display: inline-block;
            ${badgeStyle}
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-top: 10px;
            text-transform: capitalize;
        }
        .content {
            padding: 30px;
        }
        .greeting {
            color: #111827;
            margin-bottom: 20px;
            font-size: 16px;
        }
        .notification-title {
            font-size: 20px;
            font-weight: 700;
            color: ${primaryColor};
            margin-bottom: 12px;
        }
        .notification-message {
            font-size: 15px;
            color: #374151;
            line-height: 1.6;
            margin-bottom: 24px;
            background-color: #f9fafb;
            padding: 16px;
            border-left: 4px solid ${primaryColor};
            border-radius: 4px;
        }
        .action-button {
            display: inline-block;
            background-color: ${primaryColor};
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin-bottom: 20px;
            transition: opacity 0.2s;
        }
        .action-button:hover {
            opacity: 0.9;
        }
        .details-section {
            background-color: #f9fafb;
            padding: 16px;
            border-radius: 6px;
            margin-bottom: 20px;
            font-size: 14px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: 600;
            color: #6b7280;
        }
        .detail-value {
            color: #111827;
            word-break: break-word;
        }
        .footer {
            background-color: #f3f4f6;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
        }
        .footer-links {
            margin-bottom: 12px;
        }
        .footer-link {
            color: ${primaryColor};
            text-decoration: none;
            margin: 0 10px;
        }
        .divider {
            height: 1px;
            background-color: #e5e7eb;
            margin: 20px 0;
        }
        .important-notice {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 12px;
            border-radius: 4px;
            font-size: 13px;
            color: #78350f;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="logo">${logoUrl ? `<img src="${logoUrl}" alt="${companyName}" style="max-height: 50px;">` : companyName}</div>
            <div class="header-subtitle">Notification Center</div>
            <div class="badge">${notification.category}</div>
        </div>

        <!-- Main Content -->
        <div class="content">
            <div class="greeting">Hello <strong>${userName}</strong>,</div>
            
            <div class="notification-title">${notification.title}</div>
            
            <div class="notification-message">
                ${notification.message}
            </div>

            ${actionLink ? `<a href="${actionLink}" class="action-button">${actionText}</a>` : ""}

            ${
              notification.category === "security"
                ? '<div class="important-notice"><strong>⚠️ Security Notice:</strong> If you did not perform this action, please secure your account immediately.</div>'
                : ""
            }

            <div class="divider"></div>

            <div class="details-section">
                <div class="detail-row">
                    <span class="detail-label">Notification Type</span>
                    <span class="detail-value">${notification.category}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Sent At</span>
                    <span class="detail-value">${new Date().toLocaleString()}</span>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-links">
                <a href="#" class="footer-link">View in Dashboard</a>
                <a href="#" class="footer-link">Settings</a>
                ${unsubscribeLink ? `<a href="${unsubscribeLink}" class="footer-link">Unsubscribe</a>` : ""}
            </div>
            <div>&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</div>
            <div style="margin-top: 10px; font-size: 11px;">This is an automated message. Please do not reply to this email.</div>
        </div>
    </div>
</body>
</html>
  `.trim();
};

/**
 * Generate HTML for in-app notification display
 * @param {Object} notification - Notification object
 * @param {Object} options - Configuration options
 * @returns {string} HTML for in-app display
 */
export const generateInAppHTML = (notification, options = {}) => {
  const { isDismissible = true, actionLink = null, actionText = "View" } =
    options;

  const primaryColor = getColorByUIType(notification.uiType);

  return `
<div class="notification-card" data-type="${notification.uiType}">
    <div class="notification-header" style="border-left: 4px solid ${primaryColor};">
        <div class="notification-title-in-app">${notification.title}</div>
        ${isDismissible ? '<button class="dismiss-btn" aria-label="Close">×</button>' : ""}
    </div>
    <div class="notification-body">
        <p class="notification-message-in-app">${notification.message}</p>
        ${
          actionLink
            ? `<a href="${actionLink}" class="notification-action-btn" style="color: ${primaryColor};">${actionText} →</a>`
            : ""
        }
    </div>
    <div class="notification-footer">
        <span class="notification-category" style="background-color: ${primaryColor}15; color: ${primaryColor};">${notification.category}</span>
        <span class="notification-time">${new Date().toLocaleTimeString()}</span>
    </div>
</div>

<style>
.notification-card {
    background: white;
    border-radius: 8px;
    margin-bottom: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.notification-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background-color: #f9fafb;
}

.notification-title-in-app {
    font-size: 15px;
    font-weight: 600;
    color: #111827;
}

.dismiss-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #9ca3af;
    padding: 0;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
}

.dismiss-btn:hover {
    background-color: #e5e7eb;
    color: #374151;
}

.notification-body {
    padding: 16px;
}

.notification-message-in-app {
    margin: 0;
    color: #374151;
    font-size: 14px;
    line-height: 1.5;
}

.notification-action-btn {
    display: inline-block;
    margin-top: 12px;
    text-decoration: none;
    font-weight: 600;
    font-size: 14px;
}

.notification-action-btn:hover {
    text-decoration: underline;
}

.notification-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: #f9fafb;
    border-top: 1px solid #e5e7eb;
    font-size: 12px;
}

.notification-category {
    padding: 4px 8px;
    border-radius: 12px;
    font-weight: 600;
    text-transform: capitalize;
}

.notification-time {
    color: #6b7280;
}
</style>
  `.trim();
};

/**
 * Generate plain text version of notification
 * @param {Object} notification - Notification object
 * @returns {string} Plain text notification
 */
export const generatePlainTextNotification = (notification) => {
  return `
${notification.title}
${"-".repeat(notification.title.length)}

${notification.message}

Category: ${notification.category}
Type: ${notification.uiType}

${new Date().toLocaleString()}
  `.trim();
};
