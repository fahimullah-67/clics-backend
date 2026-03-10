import {
  compareLoanSchemes,
  deleteComparison,
} from "../controllers/comparison.controller";
import Router from "express";

const router = Router();

router.route("/comparison").post(compareLoanSchemes);
router.route("/comparison/Delete").delete(deleteComparison);

export { router as comparisonRouter };
