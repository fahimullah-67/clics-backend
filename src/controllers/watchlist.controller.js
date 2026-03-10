// watchlistController
//     addToWatchlist
//     removeFromWatchlist
//     getUserWatchlist
import WatchList from "../models/watchList.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const addToWatchlist = async (req, res) => {
    try {
        const {loanSchemeId} = req.body;
        const newWatchList = new WatchList(req.body);
        
        const existWatchList = await WatchList.findOne({loanSchemeId: loanSchemeId})

        if(existWatchList){
            throw new ApiError(401, "This Scheme is already in WatchList!", "SchemeInWatchList");
        }

        const watchlistCreated = await newWatchList.save();

        res.status(201).json(
            new ApiError(201, "WatchList Creates successfully!", watchlistCreated)
        )

    } catch (error) {
    console.log("Error add To watchList :", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const removeFromWatchList = async (req,res) => {
    try {
        
        const removeWatchlist = await findByIdDelete(req.params.id);
        console.log("Delete Data SuccessFully!");
        res.json(201).json(
            new ApiError(201, "WatchList Data Successfully Deletes! ", removeWatchlist)
           
        )
        

    }catch (error) {
    console.log("Error remove WatchList :", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getUserWatchList = async (req, res) => {
    try {
        
        const allWatchlist = await WatchList.find()

        if(allWatchlist.length === 0){
            return res.status(401).json(
                new ApiError(401, "User Watch List Not Found!", "UserDataNotFound")
                )
        }

         res.status(201).json(
            new ApiResponse(201, "All Watch List Data fetch", allWatchlist)
            );
    } catch (error) {
    console.log("Error Get User Watchlist:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};