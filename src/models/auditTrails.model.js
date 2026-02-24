import mongoose from "mongoose";

const auditTrailsSchema = new mongoose.Schema(
  {
    actionId: {
      type: mongoose.Schema.Types.ObjectID,
      ref: "User",
      required: true,
    },
    actionType: {
      type: String,
      required: true,
      enum: [
        "UPDATE_PROFILE",
        "CHANGE_PASSWORD",
        "DELETE_ACCOUNT",
        "DATA_EXPORT",
        "DATA_IMPORT",
        "SETTINGS_CHANGE",
        "SCHEME_COMPARISON",
        "ADD_TO_FAVORITES",
        "REMOVE_FROM_FAVORITES",
        "LOGIN",
        "LOGOUT",
      ],
    },
    entity: {
      type: String,
      required: true,
      enum: [
        "User",
        "ChatSession",
        "LoanScheme",
        "Comparison",
        "Banks",
        "SourceSnapshot",
      ],
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectID,
      required: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      //mobile/ windows/linux/mac/chrome/firefox
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const AuditTrail = mongoose.model("AuditTrail", auditTrailsSchema);
export default AuditTrail;

// Who did what, on which data, and when (and from where)?
// Think like as a CCTV for system actions.
// AuditTrail records every important system action
// for security, tracking, and accountability.
