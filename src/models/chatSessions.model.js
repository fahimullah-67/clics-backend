import mongoose from "mongoose";

const chatSessionsSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    messages: [
      {
        role: {
          type: String,
          enum: ["user", "bot"],
        },
        text: String,
      },
    ],

    language: {
      type: String,
      enum: ["en", "ur"],
      default: "en",
    },
  },
  { timestamps: true },
);

export default mongoose.model("ChatSession", chatSessionsSchema);