import mongoose from "mongoose";

const notificationsSchema = new mongoose.schema({
    userId:{
        type: mongoose.schema.Types.ObjectID,
        ref: "User",
        required: true,
    },
    loanSchemeId:{
        type: mongoose.schema.Types.ObjectID,
        ref: "LoanSchemes",
    },
    notificationType:{
        type: String,
        enum: ["LOAN_SCHEME_UPDATE", "GENERAL", "ALERT", "REMINDER", "Security", "Promotion",  "Other"],
        required: true,
    },
    tittle:{
        type: String,
        required: true,
    },
    message:{
        type: String,
        required: true,
    },
    isRead:{
        type: Boolean,
        default: false,
    },
    sentVia:{
        type: [String],
        enum: ["EMAIL", "SMS", "PUSH_NOTIFICATION", "IN_APP"],
        required: true,
    },


},
{
    timestamps: true,
}
);

const Notification = mongoose.model("Notification", notificationsSchema);
export default Notification;