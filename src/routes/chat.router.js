
import Router from "express";

const router = Router();

import { getAllChatHistory, deleteChatHistory, askQuestion } from "../controllers/chat.controller.js";

router.route("/ask").post(askQuestion);
router.route("/").get(getAllChatHistory);
router.route("/deleteChat").delete(deleteChatHistory);

export { router as chatRouter };