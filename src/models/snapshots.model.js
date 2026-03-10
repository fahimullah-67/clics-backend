import mongoose from "mongoose";

const SnapshotSchema = new mongoose.Schema(
  {
    schemeLoanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LoanSchemes",
      required: true,
    },
    sourceType: {
      type: String,
      enum: ["webpage", "pdf"],
    },
    sourceContent: {
      type: Buffer,
      required: true,
    },
    sourceUrl: {
      type: String,
    },
    sourceTittle: {
      type: String,
    },
    filePath: {
      type: String,
    },
    captureDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timeStamps: true,
  },
);

const Snapshot = mongoose.model("snapshots", SnapshotSchema);
export default Snapshot;

// Snapshot stores the original bank web page or PDF with capture date 
// so loan data can be verified, audited, and used as evidence 
// for AI answers.