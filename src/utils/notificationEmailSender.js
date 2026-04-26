/**
 * Enhanced sendEmail utility for HTML notifications
 * 
 * This shows how to update your sendEmail function to support HTML emails
 * If your sendEmail already supports HTML, you can integrate with it directly.
 * 
 * Usage in controller:
 * 
 * const emailHTML = generateEmailHTML(notificationData, options);
 * await sendEmail(email, subject, emailHTML, true); // true = HTML
 * 
 * OR if your function uses options object:
 * 
 * await sendEmail({
 *   to: email,
 *   subject: notification.title,
 *   html: emailHTML,
 *   text: plainText,
 * });
 */

/**
 * OPTION 1: If using nodemailer directly
 * 
 * Example implementation:
 */

export const sendEmailWithHTML = async (
  to,
  subject,
  html,
  text = null,
  options = {}
) => {
  const nodemailer = require("nodemailer");

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || "noreply@clics.com",
    to: to,
    subject: subject,
    html: html,
    text: text || stripHtmlTags(html), // Fallback plain text
    ...options,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Helper function to strip HTML tags for plain text version
 */
const stripHtmlTags = (html) => {
  return html.replace(/<[^>]*>/g, "").trim();
};

/**
 * OPTION 2: If using SendGrid
 * 
 * Example implementation:
 */

export const sendEmailWithHTML_SendGrid = async (
  to,
  subject,
  html,
  text = null
) => {
  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: to,
    from: process.env.SENDGRID_FROM_EMAIL || "noreply@clics.com",
    subject: subject,
    html: html,
    text: text || stripHtmlTags(html),
    replyTo: process.env.SUPPORT_EMAIL || "support@clics.com",
  };

  try {
    const response = await sgMail.send(msg);
    console.log("Email sent via SendGrid:", response[0].statusCode);
    return {
      success: true,
      statusCode: response[0].statusCode,
    };
  } catch (error) {
    console.error("Error sending email via SendGrid:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * OPTION 3: If using AWS SES
 * 
 * Example implementation:
 */

export const sendEmailWithHTML_AWS_SES = async (
  to,
  subject,
  html,
  text = null
) => {
  const AWS = require("aws-sdk");
  const ses = new AWS.SES({
    region: process.env.AWS_REGION,
  });

  const params = {
    Source: process.env.AWS_SES_FROM_EMAIL,
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: {
        Data: subject,
      },
      Body: {
        Html: {
          Data: html,
        },
        Text: {
          Data: text || stripHtmlTags(html),
        },
      },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log("Email sent via AWS SES:", result.MessageId);
    return {
      success: true,
      messageId: result.MessageId,
    };
  } catch (error) {
    console.error("Error sending email via AWS SES:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * OPTION 4: Universal wrapper function
 * 
 * Use this to support multiple email providers
 */

export const sendNotificationEmail = async (
  to,
  subject,
  html,
  text = null,
  options = {}
) => {
  const provider = process.env.EMAIL_PROVIDER || "nodemailer";

  try {
    switch (provider) {
      case "sendgrid":
        return await sendEmailWithHTML_SendGrid(to, subject, html, text);
      case "aws-ses":
        return await sendEmailWithHTML_AWS_SES(to, subject, html, text);
      case "nodemailer":
      default:
        return await sendEmailWithHTML(to, subject, html, text, options);
    }
  } catch (error) {
    console.error(`Error sending notification email via ${provider}:`, error);
    // Log to error tracking system (Sentry, LogRocket, etc.)
    // await logError(error);

    // Don't throw - allow notification to be saved even if email fails
    return {
      success: false,
      error: error.message,
      provider: provider,
    };
  }
};

/**
 * Integration with Notification Controller
 * 
 * Update your createNotification controller like this:
 * 
 * import { sendNotificationEmail } from "../utils/notificationEmailSender.js";
 * import { generateEmailHTML, generatePlainTextNotification } from "../utils/notificationHTMLGenerator.js";
 * 
 * if (notification.sentVia.includes("EMAIL")) {
 *   const emailHTML = generateEmailHTML(
 *     { title, message, category, uiType },
 *     { userName, actionLink, actionText, companyName: "CLICS" }
 *   );
 *   
 *   const plainText = generatePlainTextNotification({
 *     title, message, category, uiType
 *   });
 *   
 *   try {
 *     const result = await sendNotificationEmail(
 *       email,
 *       notification.title,
 *       emailHTML,
 *       plainText
 *     );
 *     
 *     // Update delivery status in database
 *     notification.deliveryStatus.email.sent = result.success;
 *     if (result.success) {
 *       notification.deliveryStatus.email.sentAt = new Date();
 *     } else {
 *       notification.deliveryStatus.email.error = result.error;
 *     }
 *   } catch (error) {
 *     console.error("Email send error:", error);
 *     notification.deliveryStatus.email.error = error.message;
 *   }
 * }
 */

export { stripHtmlTags };
