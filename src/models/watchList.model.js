import mongoose from 'mongoose';

const watchListScheme = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: " User",
      required: true,
    },
    loanSchemeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LoanSchemes",
      required: true,
    },
    NotificationOnChange: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const WatchList = mongoose.model("WatchList", watchListScheme);
export default WatchList;