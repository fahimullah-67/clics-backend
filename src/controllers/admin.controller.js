import LoanSchemes from "../models/loanSchemes.model.js";
import AdminLog from "../models/admin/adminLogs.model.js";
import Notification from "../models/notifications.model.js";
import WatchList from "../models/watchList.model.js";
import { generateNotificationContent } from "../utils/notificationHelper.js";

// Approve Loan Scheme
export const approveLoanScheme = async (req, res) => {
  try {
    const { id } = req.params;

    const scheme = await LoanSchemes.findById(id);

    if (!scheme) {
      return res.status(404).json({
        message: "Loan Scheme not found",
      });
    }

    const previousData = { ...scheme._doc };

    scheme.isVerified = true;
    scheme.verifiedBy = req.user.id;
    scheme.lastUpdatedAt = new Date();

    const updated = await scheme.save();

    // Admin Log
    await AdminLog.create({
      adminId: req.user.id,
      action: "APPROVE",
      targetCollection: "LoanScheme",
      targetId: id,
      previousValue: previousData,
      newValue: updated,
    });

    // ✅ Notify Users (watchlist)
    const watchers = await Watchlist.find({ loanSchemeId: id }).populate(
      "userId",
    );

    for (let w of watchers) {
      const content = generateNotificationContent("RATE_UPDATE", {
        bankName: scheme.bankName,
        rate: scheme.interestRate,
      });

      await Notification.create({
        userId: w.userId._id,
        loanSchemeId: id,
        title: content.title,
        message: content.message,
        type: content.uiType,
        category: content.category,
      });
    }

    res.status(200).json({
      message: "Loan Scheme Approved",
      data: updated,
    });
  } catch (error) {
    console.log("Approve Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Reject Loan Scheme
export const rejectLoanScheme = async (req, res) => {
  try {
    const { id } = req.params;

    const scheme = await LoanSchemes.findById(id);

    if (!scheme) {
      return res.status(404).json({
        message: "Loan Scheme not found",
      });
    }

    const previousData = { ...scheme._doc };

    await LoanSchemes.findByIdAndDelete(id);

    // Admin Log
    await AdminLog.create({
      adminId: req.user.id,
      action: "DELETE",
      targetCollection: "LoanScheme",
      targetId: id,
      previousValue: previousData,
    });

    res.status(200).json({
      message: "Loan Scheme Rejected & Deleted",
    });
  } catch (error) {
    console.log("Reject Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//  Update Loan Scheme (Admin Edit)
export const updateLoanByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const scheme = await LoanSchemes.findById(id);

    if (!scheme) {
      return res.status(404).json({
        message: "Loan Scheme not found",
      });
    }

    const previousData = { ...scheme._doc };

    const updated = await LoanSchemes.findByIdAndUpdate(
      id,
      { $set: req.body, lastUpdatedAt: new Date() },
      { new: true },
    );

    // Admin Log
    await AdminLog.create({
      adminId: req.user.id,
      action: "UPDATE",
      targetCollection: "LoanScheme",
      targetId: id,
      previousValue: previousData,
      newValue: updated,
    });

    res.status(200).json({
      message: "Loan Scheme Updated",
      data: updated,
    });
  } catch (error) {
    console.log("Update Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Delete Loan Scheme (Admin)
export const deleteLoanByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const scheme = await LoanSchemes.findById(id);

    if (!scheme) {
      return res.status(404).json({
        message: "Loan Scheme not found",
      });
    }

    await LoanSchemes.findByIdAndDelete(id);

    // ✅ Admin Log
    await AdminLog.create({
      adminId: req.user.id,
      action: "DELETE",
      targetCollection: "LoanScheme",
      targetId: id,
      previousValue: scheme,
    });

    res.status(200).json({
      message: "Loan Scheme Deleted",
    });
  } catch (error) {
    console.log("Delete Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
