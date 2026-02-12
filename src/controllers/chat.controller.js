// chatController
//     askQuestion
//     getChatHistory
//     deleteChatHistory

import ChatSession from "../models/chatSessions.model";

export const askQuestion = async (req, res) => {
    try {
        
        const newMessage = ChatSession(req.body);

        const createMessage = await newMessage.save();

        res.status(201).json({
            message : "User Ask Question";
            data: {
                createMessage
            }
        })

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
        const userChatHistory = await chatHistory.find();

        if ( !userChatHistory){
            return res.status(401).json({
                message : "Chat History Not Exist",
                error: "UserChatHistoryNotFound"
            })
        }

        res.status(201).json({
            message:"User Chat Data Fetch SuccessFully",
            data: {
                userChatHistory
            }
        })

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
        res.status(201).json({
      message: "Delete chat history!",
      data: {
        chatDelete,
      },
    });

    } catch (error) {
    console.log("Error Delete Chat History :", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};