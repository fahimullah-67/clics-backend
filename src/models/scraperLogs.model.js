import mongoose from "mongoose";

const ScraperLogSchema = new mongoose.Schema(
  {
    bankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bank",
    },

    runDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["started", "completed", "failed"],
    },

    totalSchemesFound: Number,
    totalCreated: Number,
    totalUpdated: Number,
    totalSkipped: Number,

    errorMessage: String,

    executedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const ScraperLog = mongoose.model("ScraperLog", ScraperLogSchema);

export default ScraperLog;

// ScraperLog stores logs of each scraping run for auditing and monitoring purposes.
