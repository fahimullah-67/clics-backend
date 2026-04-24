import Router from 'express';
import {
  addToWatchlist,
  getUserWatchList,
  removeFromWatchList,
} from "../controllers/watchlist.controller.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";

const router = Router();

router.route("/addWatchlist").post(verifyToken, addToWatchlist);
router.route("/removeWatchlist").delete(verifyToken, removeFromWatchList);
router.route("/getWatchlist").get(verifyToken, getUserWatchList);

export { router as watchlistRouter };