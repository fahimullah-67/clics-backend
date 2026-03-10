import Router from 'express';
import {
  addToWatchlist,
  getUserWatchList,
  removeFromWatchList,
} from "../controllers/watchlist.controller";

const router = Router();

router.route("/addWatchlist").post(addToWatchlist);
router.route("/removeWatchlist").delete(removeFromWatchList);
router.route("/getWatchlist").get(getUserWatchList);

export { router as watchlistRouter };