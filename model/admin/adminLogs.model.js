// AdminLog stores a complete history of admin actions 
//  so any data change can be tracked and audited later.

import mongoose from "mongoose";
const adminLogsSchema = new mongoose.Schema({
    adminId:{
        type: mongoose.schema.Types.ObjectID,
        ref: "User",
        required: true,
    },
    action:{
        type: String,
        required: true,
        enum: ["CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "VERIFY", "APPROVE"],
    },
    targetCollection:{
        type: String,
        required: true,
        enum: ["User", "ChatSession", "LoanScheme", "Comparison", "Banks", "SourceSnapshot"],
    },
    targetId:{ //Which exact record was changed
        type: mongoose.schema.Types.ObjectID,
        required: true,
    },
    previousValue:{
        type: mongoose.Schema.Types.Mixed,
        required: false,
    },
    newValue:{
        type: mongoose.Schema.Types.Mixed,
        required: false,
    },
},
{
    timestamps: true,
})

const AdminLog = mongoose.model("AdminLog", adminLogsSchema);
export default AdminLog;