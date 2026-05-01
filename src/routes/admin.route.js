import {Router } from "express"
import { verifyToken, verifyTokenAndAdmin } from "../middlewares/verifyToken.middleware.js"
import { approveLoanScheme, rejectLoanScheme, updateLoanByAdmin, deleteLoanByAdmin } from "../controllers/admin.controller.js"



const router = Router()

router.route("/approve/:id").put(verifyToken, verifyTokenAndAdmin, approveLoanScheme);
router.route("/reject/:id").put(verifyToken, verifyTokenAndAdmin, rejectLoanScheme);
router.route("/update/:id").get(verifyToken, verifyTokenAndAdmin, updateLoanByAdmin);
router.route("/delete/:id").delete(verifyToken, verifyTokenAndAdmin, deleteLoanByAdmin);

export  {router as adminRouter}