// AdminLog stores a complete history of admin actions 
//  so any data change can be tracked and audited later.
import mongoose from "mongoose";



const adminLogsSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: [
        "CREATE",
        "UPDATE",
        "DELETE",
        "LOGIN",
        "LOGOUT",
        "VERIFY",
        "APPROVE",
      ],
      required: true,
    },
    targetCollection: {
      type: String,
      enum: [
        "User",
        "ChatSession",
        "LoanScheme",
        "Comparison",
        "Bank",
        "Snapshot",
      ],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    previousValue: {
      type: mongoose.Schema.Types.Mixed,
    },
    newValue: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true },
);

const AdminLog = mongoose.model("AdminLog", adminLogsSchema);

export default AdminLog;