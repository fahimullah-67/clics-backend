import Comparison from "../models/comparisons.model.js";
import LoanSchemes from "../models/loanSchemes.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/apiError.js";

export const createComparison = async (req, res) => {
  try {
    console.log("this is the comparison controller to add ids!", req.body);

    const { ids } = req.body;
    const userId = req.user.userid; // from auth middleware
    console.log("User: ", req.user);

    // console.log("Received request to create comparison with scheme IDs: ", ids);
    console.log(
      "Creating comparison for user ${userId} with scheme IDs: ",
      userId,
    );

    if (!ids || ids.length < 2) {
      return res.status(400).json({
        message: "Select at least 2 schemes",
      });
    }
    //     if (ids.length > 4) {
    //   return res.status(400).json({
    //     message: "Max 4 schemes allowed",
    //   });
    // }

    const comparison = await Comparison.create({
      userId,
      schemeIds: [...new Set(ids)],
    });
    console.log("Comparison created successfully: ", comparison);

    res
      .status(201)
      .json(
        new ApiResponse(201, comparison, "Comparison created successfully"),
      );
  } catch (error) {
    console.log(" Internal Server Error!");

    res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", error.message));
  }
};

export const getComparison = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID::", id);

    const comparison = await Comparison.findById(id).populate({
      path: "schemeIds",
      model: LoanSchemes,
      populate: {
        path: "bankId",
        select: "name",
      },
    });
    console.log("Raw comparison:", comparison);

    if (!comparison) {
      return res
        .status(404)
        .json(new ApiError(404, "Comparison not found", "comparisonNotFound"));
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, comparison, "Comparison fetched successfully"),
      );
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Internal server Error", error.message));
  }
};

export const getUserComparisons = async (req, res) => {
  try {
    const userId = req.user.id;

    const comparisons = await Comparison.find({ userId })
      .sort({ createdAt: -1 })
      .populate("schemeIds");

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          comparisons,
          "User comparisons fetched successfully",
        ),
      );
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Internal server Error", error.message));
  }
};

export const deleteFromComparison = async (req, res) => {
  try {
    const { comparisonId, schemeId } = req.body;

    const updated = await Comparison.findByIdAndUpdate(
      comparisonId,
      {
        $pull: { schemeIds: schemeId },
      },
      { new: true },
    );

    res
      .status(200)
      .json(new ApiResponse(200, updated, "Scheme removed from comparison"));
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(new ApiError(500, "Internal server Error", error.message));
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
