import { User } from '../models/index.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "$#5fahim@1234";

export const registerUser = async (req, res)=> {
    try {
        const { username, email, password} = req.body;

        const existingUser = await User.findOne({ email: email});
        if(existingUser){
            return res.status(400).json({
                message: "User With this email already exists",
                error: "EmailExists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })
        await newUser.save();

        const payload = {
            userid : newUser._id,
            username: newUser.username,
            email: newUser.email,
        }
        const token = jwt.sign(
            {
                payload, 
                JWT_SECRET
            },
            {
                expiresIn: "7d"
            }
        )

        res.cookie("jwt", token, {
            httpOnly:true,
            secure : process.env.NODE_ENV === "production",
            sameSite : "strict",
            maxAge : 7*24*60*60*1000,
        })

        res.status(201).json({
            message: "User Registered SuccessFully",
            data:{
                userId : newUser._id,
                username: newUser.username,
                email: newUser.email,
                token:token,
            }
        })


    } catch (error) {
        console.log("Error registering user:", error);
        res.status(500).
        json({
            message: "Internal Server Error",
            error: error.message,
        })
        
    }
}

export const loginUser = async (req, res)=> {
    try {
        const { email, password} = req.body;

        const existingUser = await User.findOne({email: email})
         if(!existingUser){
            return res.status(401).json({
                message: "User With this email does not exists",
                error: "EmailNotExists"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordCorrect){
            return res.status(401).json({
                message: "Incorrect Password",
                error: "IncorrectPassword"
            })
        }

        const payload = {
            userid : newUser._id,
            username: newUser.username,
            email: newUser.email,
        }
        const token = jwt.sign(
            {
                payload, 
                JWT_SECRET
            },
            {
                expiresIn: "7d"
            }
        )

        res.cookie("jwt", token, {
            httpOnly:true,
            secure : process.env.NODE_ENV === "production",
            sameSite : "strict",
            maxAge : 7*24*60*60*1000,
        })


        res.status(201).json({
            message: "User Login SuccessFully",
            data:{
                userId : existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                token:token,
            }
        })

        
        
    } catch (error) {
        console.log("Error logging in User", error);
        res.status(500).
        json({
            message: "Internal Server Error",
            error: error.message,
        })
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId).select(
            "-password -__v -createdAt -updatedAt"
        )
        res.status(200).json({
            message: "User Profile Retrieved Successfully",
            data: user
        })

    } catch (error) {
        console.log("Inter Server Error", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        })
        
    }
}

export const updateUserProfile = async (req , res)=> {
    try {
        const userId = req.userId;
        const { username, email } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                username,
                email,
            },
            {
            new : true,
            runValidators: true,
            }        
        ).select("-password -__v -createdAt" )
        
        if(!updatedUser){
            return res.status(404).json({
                message: "User not Found",
                error: "UserNotFound"
            })
        }
        res.status(200).json({
                message: "user Profile Updated Successfully",
                updatedUser,
            })
        
    } catch (error) {
        console.log("Inter Server Error", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        })
        
    }
}

export const deleteUserAccount = async (req , res) => {
    try {
        const userId = req.userId;
        
        await User.findByIdAndDelete(userId);
        res.status(200).json({
            message: "User Account Deleted SuccessFully",
        })

        
    } catch (error) {
        console.log("Inter Server Error", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        })
    }
    
}

export const getAllUsers = async (req, res) =>{
    try {
        const users = await User.find()
        .select("- password -__v -createdAt -updatedAt");

        if(users.length === 0){
            return res.status(404).json({
                message: "No Users Found",
                error: "NoUsersFound"
            })
        }else{
            res.status(200).json({
                message: "Users Retrieved Successfully",
                data: users,
            })
        }

    } catch (error) {
        console.log("Inter Server Error", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        })
    }
}

export const passwordReset = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({
            email: email
        })
        if(!user){
            return res.status(404).json({
                message: "User with this email does not exists",
                error: "EmailNotExists"
            })
        }else{
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password= hashedPassword;

            await user.save();

            res.status(200).json({
                message: "Password Reset Successfully",
                data: { email:user.email}
            })

        }
        
    } catch (error) {
        console.log("Inter Server Error", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        })
    }
}

export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.userId;

        const user = await User.findById(userId);
        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
        
        if(!isPasswordCorrect){
            return res.status(404).json({
                message: "Incorrect Old Password",
                error: "IncorrectOldPassword"
            })
        }else{
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password= hashedPassword;

            await user.save();

            res.status(200).json({
                message: "Password Changed Successfully",
                data: { email:user.email}
            })

        }
        
    } catch (error) {
        console.log("Inter Server Error", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        })
    }
}

export const logoutUser = async (req, res) => {
    try {
        
        res.cookie("jwt", "", {
            httpOnly: true,
            expires: new Date(0),
        })
        res.status(200).json({
            message : "User Logged Out SuccessFully",
        })
        
    } catch (error) {
        console.log("Inter Server Error", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        })
    }
}
