// store selected loan IDs
// fetch those loans
// return data for UI comparison

export const compareLoanSchemes = async (req, res) => {
  const { ids } = req.body; // array of loanSchemeIds (2–4)

  const schemes = await LoanScheme.find(
    { _id: { $in: ids }, isVerified: true }
  ).populate("bankId", "bankName");

  res.status(200).json(schemes);
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