import { Router } from "express";
import verifyToken, { verifyTokenAndAdmin } from "../middleware/verifyToken.js";
import {
  createBank,
  deleteBank,
  getAllBankData,
  getBankById,
  updateBank,
} from "../controllers/bank.controller.js";

const router = Router();

router.route("/banks/create").post(verifyToken, verifyTokenAndAdmin, createBank);
router.route("/banks/getAll").get(getAllBankData);
router.route("/banks/getOne").get(getBankById);
router.route("/banks/update").put(verifyToken, verifyTokenAndAdmin, updateBank);
router
  .route("/banks/delete")
  .delete(verifyToken, verifyTokenAndAdmin, deleteBank);

export { router as bankRouter };