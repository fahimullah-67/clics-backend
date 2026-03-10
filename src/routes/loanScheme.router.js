import { verifyLoanScheme } from "../controllers/loanScheme.Controller";
import { verifyToken, verifyTokenAndAdmin } from "../middlewares/verifyToken.middleware";

// router.route("/user/register").post(registerUser);

router.route("/loanSchemes/create").post(verifyToken, verifyTokenAndAdmin, createLoanScheme);
router.route("/loanSchemes/getAll").get(getAllLoanSchemes);
router.route("/loanSchemes/getOne/:id").get(getLoanSchemeById);
router.route("/loanSchemes/update/:id").put(verifyToken, verifyTokenAndAdmin, updateLoanScheme);
router.route("/loanSchemes/delete/:id").delete(verifyToken, verifyTokenAndAdmin, deleteLoanScheme);
router.route("/loanSchemes/verify").post(verifyLoanScheme);
router.route("/filter-loan-schemes").get(filterLoanSchemes);
router.route("/compare-loan-schemes").post(compareLoanSchemes);
router.route("/recommend-loan-schemes").post(recommendLoanSchemes);

export { router as loanSchemeRouter };