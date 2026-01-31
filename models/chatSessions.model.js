import mongoose from "mongoose";

const chatSessionsSchema = new mongoose.schema({
    userID:{
        type: mongoose.schema.Types.ObjectID,
        ref: "User",
        required: true,
    },
    questions:{
        types: [String],
        required: true,
    },
    answers:{
        types: [String],
        required: true,
    },
    language:{
        type: String,
        required: true,
        enum: ["en", "ur", "fr", "de", "zh"],
        default: "en",
    },
    sourceSnapshotIds:{
        type: mongoose.schema.Types.ObjectID,
        ref: "SourceSnapshots",
        required: true,
    },
    confidenceScores:{
        types: [Number],
        required: true,
    }
},
{
    timestamps: true,
})

const ChatSession = mongoose.model("ChatSession", chatSessionsSchema);
export default ChatSession;

