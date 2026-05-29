// chatController
//     askQuestion
//     getChatHistory
//     deleteChatHistory

import ChatSession from "../models/chatSessions.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const askQuestion = async (req, res) => {
  try {
    const { question, answer, chatId } = req.body;
    const userId = req.user.userid;

    if (chatId) {
      const chat = await ChatSession.findById(chatId);

      if (!chat || chat.userid.toString() !== userId.toString()) {
        return res.status(404).json({ error: "Chat not found" });
      }

      chat.messages.push(
        { role: "user", text: question },
        { role: "bot", text: answer },
      );

      chat.updatedAt = new Date();

      await chat.save();

      return res
        .status(201)
        .json(new ApiResponse(201, chatId, "Chat updated, new messages added"));
    } else {
      const newChat = new ChatSession({
        userid: userId,
        messages: [
          { role: "user", text: question },
          { role: "bot", text: answer },
        ],
        language: "en",
      });

      await newChat.save();
      const newChatId = newChat._id;

      return res
        .status(201)
        .json(new ApiResponse(201, newChatId, "New chat created"));
    }
  } catch (error) {
    console.error("Chat/Question/Answer error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const userid = req.user.userid;
    const chats = await ChatSession.find({ userid: userid }).sort({
      createdAt: -1,
    });

    if (!chats) {
      throw new ApiError(
        401,
        "User Chat History Not Found!",
        "UserChatHistoryNotFound",
      );
    }

    res
      .status(201)
      .json(new ApiResponse(201, chats, "User Chat Data Fetch SuccessFully"));
  } catch (error) {
    console.log("Error fetch All chat History!  :", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const deleteChatHistory = async (req, res) => {
  try {
    await ChatSession.findByIdAndDelete(req.params.id);

    res.status(201).json(new ApiResponse(201, "", "Delete chat history!"));
  } catch (error) {
    console.log("Error Delete Chat History :", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};