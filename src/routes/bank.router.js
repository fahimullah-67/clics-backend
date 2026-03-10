import { Router } from "express";
import verifyToken, { verifyTokenAndAdmin } from "../middleware/verifyToken.js";

const router = Router();

router.route("/banks/create").post(verifyToken, verifyTokenAndAdmin, createBank);
router.route("/banks/getAll").get(getAllBankData);
router.route("/banks/getOne/:id").get(getBankById);
router.route("/banks/update/:id").put(verifyToken, verifyTokenAndAdmin, updateBank);
router.route("/banks/delete/:id").delete(verifyToken, verifyTokenAndAdmin, deleteBank);

export { router as bankRouter };