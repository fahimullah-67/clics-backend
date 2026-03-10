import { Router } from "express";
// import { verifyToken, verifyTokenAndAdmin } from "../middleware/verifyToken.middleware.js";
import { verifyToken , verifyTokenAndAdmin, verifyTokenAndAuthorization} from "../middlewares/verifyToken.middleware.js";

import {
  createBank,
  deleteBank,
  getAllBankData,
  getBankById,
  updateBank,
} from "../controllers/bank.controller.js";

const router = Router();

router.route("/banks/create").post(verifyTokenAndAdmin, createBank);
router.route("/banks/getAll").get(getAllBankData);
router.route("/banks/getOne").get(getBankById);
router.route("/banks/update").put(verifyToken, verifyTokenAndAdmin, updateBank);
router
  .route("/banks/delete/:id")
  .delete(verifyTokenAndAuthorization, deleteBank);

export { router as bankRouter };