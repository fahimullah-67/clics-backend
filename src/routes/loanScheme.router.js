import { Router } from "express";
import {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} from "../middlewares/verifyToken.middleware.js";

import {
  compareLoanSchemes,
  createLoanScheme,
  deleteLoanScheme,
  filterLoanSchemes,
  getAllLoanSchemes,
  getLoanSchemeById,
  recommendLoanScheme,
  updateLoanScheme,
  verifyLoanScheme,
} from "../controllers/loanScheme.Controller.js";

const router = Router();

router.route("/create").post(verifyTokenAndAdmin, createLoanScheme);
router.route("/getAll").get(getAllLoanSchemes);
router.route("/getOne").get(getLoanSchemeById);
router.route("/update").put(verifyTokenAndAuthorization, updateLoanScheme);
router
  .route("/delete/:id")
  .delete(verifyTokenAndAuthorization, deleteLoanScheme);
router.route("/verify").post(verifyLoanScheme);
router.route("/filter-loan-schemes").get(filterLoanSchemes);
router.route("/compare-loan-schemes").post(compareLoanSchemes);
router.route("/recommend-loan-schemes").post(recommendLoanScheme);

export { router as loanSchemeRouter };
