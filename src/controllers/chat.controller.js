// chatController
//     askQuestion
//     getChatHistory
//     deleteChatHistory

import ChatSession from "../models/chatSessions.model.js";
import {ApiResponse} from "../utils/apiResponse.js";
import {ApiError} from "../utils/apiError.js";

export const askQuestion = async (req, res) => {
    try {
        
        const newMessage = new ChatSession(req.body);

        const createMessage = await newMessage.save();

        res.status(201).json(
          new ApiResponse(201, "User Ask Question", createMessage)
          );

    } catch (error) {
    console.log("Error User Ask question :", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getChatHistory = async (req, res) => {
    try {
        const userChatHistory = await ChatSession.find();

        if ( !userChatHistory){
            throw new ApiError(401, "User Chat History Not Found!", "UserChatHistoryNotFound");
        }

        res.status(201).json(
          new ApiResponse(201, "User Chat Data Fetch SuccessFully", userChatHistory)
          );

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
        
        const chatDelete = await findByIdDelete(req.params.id);
        res.status(201).json(
          new ApiResponse(201, "Delete chat history!", chatDelete)
          );

    } catch (error) {
    console.log("Error Delete Chat History :", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};