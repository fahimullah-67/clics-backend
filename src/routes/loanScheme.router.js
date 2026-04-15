import { Router } from "express";
import {
  verifyToken,
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
import { createComparison } from "../controllers/comparison.controller.js";

const router = Router();

router.route("/create").post(verifyToken, createLoanScheme);
router.route("/getAll").get(getAllLoanSchemes);
router.route("/getOne").get(getLoanSchemeById);
router
  .route("loanSchemes/update")
  .put(verifyTokenAndAuthorization, updateLoanScheme);
router
  .route("loanSchemes/delete/:id")
  .delete(verifyTokenAndAuthorization, deleteLoanScheme);
router.route("loanSchemes/verify").post(verifyLoanScheme);
router.route("loanSchemes/filter-loan-schemes").get(filterLoanSchemes);
router.route("loanSchemes/compare-loan-schemes").post(compareLoanSchemes);
router.route("loanSchemes/recommend-loan-schemes").post(recommendLoanScheme);


export { router as loanSchemeRouter };
