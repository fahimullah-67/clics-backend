// watchlistController
//     addToWatchlist
//     removeFromWatchlist
//     getUserWatchlist
import WatchList from "../models/watchList.model.js";

export const addToWatchlist = async (req, res) => {
    try {
        const {loanSchemeId} = req.body;
        const newWatchList = WatchList(req.body);
        
        const existWatchList = await WatchList.findOne({loanSchemeId: loanSchemeId})

        if(existWatchList){
            res.status(401).json({
                message: "This Scheme is already in WatchList!",
                error: "SchemeInWatchList"
            })
        }

        const watchlistCreated = WatchList.save();

        res.status(201).json({
            message: "WatchList Creates successfully!",
            data:{
                watchlistCreated,
            }
        })

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
        res.json(201).json({
            message: "WatchList Data Successfully Deletes! ",
            data:{
                removeWatchlist
            }
        })
        

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

        if(allWatchlist == 0){
            return res.status(401).json({
                message: "User Watch List Not Found!",
                error: "UserDataNotFound"
            })
        }

         res.status(201).json({
            message: "All Watch List Data fetch",
            data: {
                allWatchlist,
      },
    });
    } catch (error) {
    console.log("Error Get User Watchlist:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};