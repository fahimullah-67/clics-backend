import mongoose from "mongoose";

const vectorIndexSchema = new mongoose.Schema(
  {
    loanSchemeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LoanSchemes",
      required: true,
    },
    snapshotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Snapshot",
      required: true,
    },
    textChunks: {
      type: [String],
      required: true,
    },
    vectorEmbeddings: {
      type: [[Number]],
      required: true,
    },

    // ✅ ADD THIS (VERY IMPORTANT)
    metadata: {
      bankName: String,
      schemeName: String,
      typeLoan: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("VectorIndex", vectorIndexSchema);