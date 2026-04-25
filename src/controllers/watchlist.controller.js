// watchlistController
//     addToWatchlist
//     removeFromWatchlist
//     getUserWatchlist
import WatchList from "../models/watchList.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const addToWatchlist = async (req, res) => {
  try {
    const userId = req.user.userid;
    console.log("User id; ", userId);

    const { loanSchemeId } = req.body;
    const newWatchList = new WatchList({
      loanSchemeId,
      userid: userId,
    });

    const existWatchList = await WatchList.findOne({
      loanSchemeId: loanSchemeId,
      userid: userId,
    });

    if (existWatchList) {
      return res
        .status(401)
        .json(
          new ApiError(
            401,
            "SchemeInWatchList",
            "This Scheme is already in WatchList!",
          ),
        );
    }

    const watchlistCreated = await newWatchList.save();

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          watchlistCreated,
          "WatchList Creates successfully!",
        ),
      );
  } catch (error) {
    console.log("Error add To watchList :", error);
    res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", error.message));
  }
};

export const removeFromWatchList = async (req, res) => {
  try {
    const removeWatchlist = await WatchList.findByIdAndDelete(req.params.id);
    console.log("Delete Data SuccessFully!");
    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          removeWatchlist,
          "WatchList Data Successfully Deletes! ",
        ),
      );
  } catch (error) {
    console.log("Error remove WatchList :", error);
    res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", error.message));
  }
};

export const getUserWatchList = async (req, res) => {
  try {
    const userId = req.user.userid;
    const allWatchlist = await WatchList.find({ userid: userId })
      .populate({
        path: "loanSchemeId",
        populate: {
          path: "bankId",
          select: "name",
        },
      })
      .exec();

    if (allWatchlist?.length === 0) {
      return res
        .status(401)
        .json(
          new ApiError(401, "UserDataNotFound", "User Watch List Not Found!"),
        );
    }

    res
      .status(201)
      .json(new ApiResponse(201, allWatchlist, "All Watch List Data fetch"));
  } catch (error) {
    console.log("Error Get User Watchlist:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};