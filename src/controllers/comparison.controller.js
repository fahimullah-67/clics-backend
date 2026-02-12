// store selected loan IDs
// fetch those loans
// return data for UI comparison
import LoanScheme from "../models/loanSchemes.model.js";

export const compareLoanSchemes = async (req, res) => {
  try {
    const { ids } = req.body; // array of loanSchemeIds (2–4)

    const schemes = await LoanScheme.find({
      _id: { $in: ids },
      isVerified: true,
    }).populate("bankId", "bankName");

    res.status(200).json({
      message: "Compare Successfully",
      data: {
        schemes,
      },
    });
  } catch (error) {
    console.log("Error compare Loan Scheme :", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const deleteComparison = async (req, res) => {
  try {
    const loanBankDelete = findByIdDelete(req.params.id);
    console.log("Bank Delete Successfully");
    res.status(201).json({
      message: "Delete Loan From Compare page!",
      data: { loanBankDelete },
    });
  } catch (error) {
    console.log("Error Bank creating :", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// comparisonController


// tomorrow work 


// snapshotController
//     createSnapshot (scraper only)
//     getSnapshotsByLoanScheme
//     viewSnapshot
//     deleteSnapshot

// watchlistController
//     addToWatchlist
//     removeFromWatchlist
//     getUserWatchlist

// createComparison
//     getUserComparison
//     updateComparison
//     deleteComparison

// chatController
//     askQuestion
//     getChatHistory
//     deleteChatHistory