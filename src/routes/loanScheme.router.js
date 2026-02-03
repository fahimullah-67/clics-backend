import { verifyLoanScheme } from "../controllers/loanScheme.Controller";
import { verifyToken, verifyTokenAndAdmin } from "../middlewares/verifyToken.middleware";


router.put(
  "/loan/verify/:id",
  verifyToken,  // middleware runs first
  verifyTokenAndAdmin,
  verifyLoanScheme      // controller runs after
);
