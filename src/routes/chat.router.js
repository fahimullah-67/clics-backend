import Router from "express";
import {
  deleteChatHistory,
  askQuestion,
  getChatHistory,
} from "../controllers/chat.controller.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";

const router = Router();

router.route("/ask").post(verifyToken, askQuestion);
router.route("/").get(getChatHistory);
router.route("/deleteChat").delete(deleteChatHistory);

export { router as chatRouter };
