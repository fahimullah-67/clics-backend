import mongoose from "mongoose";

const comparisonSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    schemeIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LoanScheme",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Comparison = mongoose.model("Comparison", comparisonSchema);
export default Comparison;