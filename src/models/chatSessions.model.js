import mongoose from "mongoose";

const chatSessionsSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questions: {
      type: [String],
      required: true,
    },
    answers: {
      type: [String],
      required: true,
    },
    language: {
      type: [String],
      required: true,
      enum: ["en", "ur", "fr", "de", "zh"],
      default: "en",
    },
    sourceSnapshotIds: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SourceSnapshots",
      required: true,
    },
    confidenceScores: {
      type: [Number],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const ChatSession = mongoose.model("ChatSession", chatSessionsSchema);
export default ChatSession;

