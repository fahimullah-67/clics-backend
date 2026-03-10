import {
  compareLoanSchemes,
  deleteComparison,
} from "../controllers/comparison.controller.js";
import Router from "express";

const router = Router();

router.route("/comparison").post(compareLoanSchemes);
router.route("/comparison/Delete").delete(deleteComparison);

export { router as comparisonRouter };
