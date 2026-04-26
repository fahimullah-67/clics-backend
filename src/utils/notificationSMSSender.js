// /**
//  * SMS Notification Utility
//  * Supports multiple SMS providers: Twilio, AWS SNS, Vonage/Nexmo
//  * 
//  * Environment Variables Needed:
//  * - SMS_PROVIDER: "twilio" | "aws-sns" | "vonage" (default: "twilio")
//  * - For Twilio: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
//  * - For AWS SNS: AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
//  * - For Vonage: VONAGE_API_KEY, VONAGE_API_SECRET, VONAGE_FROM_NAME
//  */

// // ============================================
// // OPTION 1: TWILIO SMS
// // ============================================

// export const sendSMS_Twilio = async (phoneNumber, message) => {
//   try {
//     const twilio = require("twilio");

//     const accountSid = process.env.TWILIO_ACCOUNT_SID;
//     const authToken = process.env.TWILIO_AUTH_TOKEN;
//     const fromPhone = process.env.TWILIO_PHONE_NUMBER;

//     if (!accountSid || !authToken || !fromPhone) {
//       throw new Error("Missing Twilio configuration");
//     }

//     const client = twilio(accountSid, authToken);

//     const smsMessage = await client.messages.create({
//       body: message,
//       from: fromPhone,
//       to: phoneNumber,
//     });

//     console.log("SMS sent via Twilio:", smsMessage.sid);
//     return {
//       success: true,
//       provider: "twilio",
//       messageId: smsMessage.sid,
//       status: smsMessage.status,
//     };
//   } catch (error) {
//     console.error("Error sending SMS via Twilio:", error);
//     return {
//       success: false,
//       provider: "twilio",
//       error: error.message,
//     };
//   }
// };

// // ============================================
// // OPTION 2: AWS SNS SMS
// // ============================================

// export const sendSMS_AWS_SNS = async (phoneNumber, message) => {
//   try {
//     const AWS = require("aws-sdk");

//     const sns = new AWS.SNS({
//       region: process.env.AWS_REGION,
//     });

//     const params = {
//       Message: message,
//       PhoneNumber: phoneNumber,
//       MessageAttributes: {
//         "AWS.SNS.SMS.SenderID": {
//           DataType: "String",
//           StringValue: process.env.AWS_SNS_SENDER_ID || "CLICS",
//         },
//         "AWS.SNS.SMS.SMSType": {
//           DataType: "String",
//           StringValue: "Transactional",
//         },
//       },
//     };

//     const result = await sns.publish(params).promise();

//     console.log("SMS sent via AWS SNS:", result.MessageId);
//     return {
//       success: true,
//       provider: "aws-sns",
//       messageId: result.MessageId,
//     };
//   } catch (error) {
//     console.error("Error sending SMS via AWS SNS:", error);
//     return {
//       success: false,
//       provider: "aws-sns",
//       error: error.message,
//     };
//   }
// };

// // ============================================
// // OPTION 3: VONAGE (Nexmo) SMS
// // ============================================

// export const sendSMS_Vonage = async (phoneNumber, message) => {
//   try {
//     const Vonage = require("@vonage/server-sdk");

//     const vonage = new Vonage({
//       apiKey: process.env.VONAGE_API_KEY,
//       apiSecret: process.env.VONAGE_API_SECRET,
//     });

//     const from = process.env.VONAGE_FROM_NAME || "CLICS";
//     const to = phoneNumber.replace(/\D/g, ""); // Remove non-digits

//     return new Promise((resolve, reject) => {
//       vonage.message.sendSms(from, to, message, (err, responseData) => {
//         if (err) {
//           console.error("Error sending SMS via Vonage:", err);
//           reject(err);
//         } else {
//           if (responseData.messages[0]["status"] === "0") {
//             console.log("SMS sent via Vonage:", responseData.messages[0][
//               "message-id"
//             ]);
//             resolve({
//               success: true,
//               provider: "vonage",
//               messageId: responseData.messages[0]["message-id"],
//             });
//           } else {
//             console.log(
//               "Message failed with error:",
//               responseData.messages[0]["error-text"]
//             );
//             reject(
//               new Error(
//                 `SMS failed: ${responseData.messages[0]["error-text"]}`
//               )
//             );
//           }
//         }
//       });
//     });
//   } catch (error) {
//     console.error("Error sending SMS via Vonage:", error);
//     return {
//       success: false,
//       provider: "vonage",
//       error: error.message,
//     };
//   }
// };

// // ============================================
// // UNIVERSAL SMS SENDER
// // ============================================

// export const sendSMS = async (phoneNumber, message, options = {}) => {
//   const provider = process.env.SMS_PROVIDER || "twilio";

//   // Validate phone number format
//   if (!phoneNumber || phoneNumber.trim().length === 0) {
//     return {
//       success: false,
//       error: "Invalid phone number",
//       provider: provider,
//     };
//   }

//   // Truncate message if too long (SMS character limit)
//   const maxLength = 160;
//   const truncatedMessage =
//     message.length > maxLength ? message.substring(0, maxLength - 3) + "..." : message;

//   try {
//     switch (provider) {
//       case "aws-sns":
//         return await sendSMS_AWS_SNS(phoneNumber, truncatedMessage);
//       case "vonage":
//         return await sendSMS_Vonage(phoneNumber, truncatedMessage);
//       case "twilio":
//       default:
//         return await sendSMS_Twilio(phoneNumber, truncatedMessage);
//     }
//   } catch (error) {
//     console.error(`Error sending SMS via ${provider}:`, error);
//     return {
//       success: false,
//       provider: provider,
//       error: error.message,
//     };
//   }
// };

// /**
//  * Generate concise SMS message from notification
//  * SMS has character limit, so keep it short
//  */
// export const generateSMSMessage = (notification) => {
//   const maxLength = 160;
//   let message = `CLICS: ${notification.title}. ${notification.message}`;

//   if (message.length > maxLength) {
//     message = `${notification.title}. ${notification.message.substring(
//       0,
//       maxLength - notification.title.length - 5
//     )}...`;
//   }

//   return message;
// };

// export { Vonage };
