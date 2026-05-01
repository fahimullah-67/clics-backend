import LoanSchemes from "../models/loanSchemes.model.js";
import WatchList from "../models/watchList.model.js";
import Notification from "../models/notification.model.js";
import { generateNotificationContent } from "../utils/notificationHelper.js";
import { sendEmail } from "../utils/sendMailer.js";
import { detectChanges } from "../utils/detectChanges.js";

export const handleLoanSchemeUpdate = async (schemeId, newData) => {
  try {
    const existingScheme = await LoanSchemes.findById(schemeId);

    if (!existingScheme) return;

    const changes = detectChanges(existingScheme, newData);

    //  No change → do nothing
    if (changes.length === 0) return;

    //  Update DB
    await LoanSchemes.findByIdAndUpdate(schemeId, {
      $set: newData,
      lastUpdatedAt: new Date(),
    });

    //  Find users who saved this scheme
    const watchers = await Watchlist.find({ loanSchemeId: schemeId }).populate(
      "userId",
    );

    for (let watch of watchers) {
      const user = watch.userId;

      const content = generateNotificationContent("RATE_UPDATE", {
        bankName: existingScheme.bankName,
        rate: newData.interestRate,
      });

      // Save notification
      await Notification.create({
        userId: user._id,
        loanSchemeId: schemeId,
        type: content.uiType,
        category: content.category,
        title: content.title,
        message: content.message,
        sentVia: ["IN_APP"],
      });

      // Optional Email
      if (user.email) {
        await sendEmail({
          to: user.email,
          subject: content.title,
          html: `<p>${content.message}</p>`,
        });
      }
    }

    console.log("Notifications sent to watchers");
  } catch (error) {
    console.log("Error in auto notification trigger:", error);
  }
};