import {
  createComparison,
  deleteFromComparison,
  getComparison,
  getUserComparisons,
} from "../controllers/comparison.controller.js";
import Router from "express";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";

const router = Router();

router.route("/comparison").post(verifyToken, createComparison);
router.route("/comparison/:id").get(verifyToken, getComparison);
router.route("/comparison/user").get(verifyToken, getUserComparisons);
router.route("/comparison/:id").delete(verifyToken, deleteFromComparison);

export { router as comparisonRouter };