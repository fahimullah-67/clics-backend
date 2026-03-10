
import Router from "express";

const router = Router();


import {
  deleteChatHistory,
  askQuestion,
  getChatHistory,
} from "../controllers/chat.controller.js";

router.route("/ask").post(askQuestion);
router.route("/").get(getChatHistory);
router.route("/deleteChat").delete(deleteChatHistory);

export { router as chatRouter };