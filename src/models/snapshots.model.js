import mongoose from "mongoose";

const SnapshotSchema = new mongoose.Schema(
  {
    loanSchemeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LoanSchemes",
      required: true,
    },

    sourceType: {
      type: String,
      enum: ["webpage", "pdf", "api"],
      default: "webpage",
    },

    sourceUrl: String,
    sourceTitle: String,

    filePath: String, // for pdf/image

    rawData: mongoose.Schema.Types.Mixed, // store scraped JSON

    captureDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Snapshot", SnapshotSchema);

// Snapshot stores the original bank web page or PDF with capture date 
// so loan data can be verified, audited, and used as evidence 
// for AI answers.