import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { sendEmail } from "../utils/sendEmail.js";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET; //|| "$#5fahim@1234";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        message: "User With this email already exists",
        error: "EmailExists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // const createUser = newUser().select(" -password")

    const payload = {
      userid: newUser._id,
      username: newUser.username,
      email: newUser.email,
    };

    const token = jwt.sign(
      {
        payload,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false, //process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await sendEmail(
      newUser.email,
      "Welcome to CLICS 🎉",
      `
  <div style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, sans-serif;">
    <table width="100%" style="border-collapse:collapse; padding:30px 0;">
      <tr>
        <td align="center">
          
          <table width="600" style="border-collapse:collapse; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 6px 18px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(90deg,#2563eb,#4f46e5); padding:25px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:26px;">
                  Welcome to CLICS 🚀
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:35px; color:#333;">
                <h2 style="margin-top:0;">Hi ${newUser.username},</h2>

                <p style="font-size:16px; line-height:1.7;">
                  🎉 Your account has been created successfully!
                </p>

                <p style="font-size:15px; line-height:1.7;">
                  We’re excited to have you on board. You can now access your dashboard, 
                  manage your account, and explore all features of our platform.
                </p>

                <!-- Info Box -->
                <div style="background:#f1f5f9; padding:18px; border-radius:8px; margin:25px 0;">
                  <p style="margin:0; font-size:14px;">
                    <strong>Email:</strong> ${newUser.email}
                  </p>
                  <p style="margin:5px 0 0 0; font-size:14px;">
                    <strong>Registered On:</strong> ${new Date().toLocaleDateString()}
                  </p>
                </div>

                <!-- CTA Button -->
                <div style="text-align:center; margin:30px 0;">
                  <a href="http://clics.vercel.app/dashboard"
                    style="background-color:#2563eb; color:#ffffff; 
                    padding:14px 28px; text-decoration:none; 
                    border-radius:6px; font-weight:bold; font-size:15px;">
                    Go To Dashboard
                  </a>
                </div>

                <p style="font-size:14px; color:#6b7280;">
                  If you have any questions, feel free to contact our support team.
                </p>

                <p style="font-size:14px;">
                  — The CLICS Team 💙
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f8fafc; padding:18px; text-align:center; font-size:12px; color:#9ca3af;">
                © ${new Date().getFullYear()} CLICS System. All rights reserved.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </div>
  `,
    );

    const data = {
      userId: newUser._id,
      username: newUser.username,
      email: newUser.email,
      token: token,
    };

    res
      .status(201)
      .json(new ApiResponse(200, "User Registered SuccessFully", data));
  } catch (error) {
    console.log("Error registering user:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    //debugging logs
    // console.log("Headers:", req.headers);
    // console.log("Body:", req.body);

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(401).json({
        message: "User With this email does not exists",
        error: "EmailNotExists",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Incorrect Password",
        error: "IncorrectPassword",
      });
    }

    if (existingUser.isLoggedIn) {
      throw new ApiError(400, "User already logged in");
    }
    existingUser.isLoggedIn = true;
    await existingUser.save();

    const payload = {
      userid: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
    };
    const token = jwt.sign(
      {
        payload,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await sendEmail(
      existingUser.email,
      "Login Alert 🚨",
      `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px;">
    <table width="100%" style="border-collapse:collapse; max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      
      <tr>
        <td style="background: linear-gradient(90deg, #2563eb, #4f46e5); padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0;">Login Alert 🚨</h1>
        </td>
      </tr>

      <tr>
        <td style="padding: 30px; color: #333;">
          <h2 style="margin-top: 0;">Hello ${existingUser.username},</h2>
          
          <p style="font-size: 16px; line-height: 1.6;">
            You just logged into your account successfully.
          </p>

          <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px;">
              <strong>Time:</strong> ${new Date().toLocaleString()}
            </p>
          </div>

          <p style="font-size: 15px; line-height: 1.6;">
            If this wasn’t you, please reset your password immediately to protect your account.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="http://clics.vercel.app/settings"
              style="background-color: #ef4444; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Reset Password
            </a>
          </div>

          <p style="font-size: 13px; color: #6b7280;">
            This is an automated message from CLICS System. Please do not reply to this email.
          </p>
        </td>
      </tr>

      <tr>
        <td style="background-color: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #9ca3af;">
          © ${new Date().getFullYear()} CLICS System. All rights reserved.
        </td>
      </tr>

    </table>
  </div>
  `,
    );

    res.status(201).json({
      message: "User Login SuccessFully",
      data: {
        userId: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        token: token,
      },
    });
  } catch (error) {
    console.log("Error logging in User", error);
    res.status(500).json({
      message: "Internal Server Error/Use Login",
      error: error.message,
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userid;

    const user = await User.findById(userId).select(
      "-password -__v -createdAt -updatedAt",
    );

    if (!user) {
      throw new ApiError(404, "User not Found");
    }

    res
      .status(200)
      .json(new ApiResponse(201, user, "User Profile Retrieved Successfully"));

    // const userId = req.userId;

    // const user = await User.findById(userId, _id).select(
    //   "-password -__v -createdAt -updatedAt",
    // );

    // if (!user) {
    //   throw new ApiError(404, "User not Found!");
    // }

    // res.status(200).json({
    //   message: "User Profile Retrieved Successfully",
    //   data: req.user,
    // });
  } catch (error) {
    console.log("Inter Server Error", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    // const userId = req.params;
    // const userId = req.user.id;
    const userId = req.user.userid;

    const { username, email, phone, address } = req.body;

    console.log("REQ USER:", req.user);
    console.log("USER ID ", userId);
    console.log("USER UserName ", username);
    console.log("USER UserEmail ", email);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username,
        email,
        phone,
        address,
        dateOfBirth: req.body.dateOfBirth,
      },
      {
        new: true,
        // runValidators: true,
      },
    ).select("-password -__v -createdAt");

    if (!updatedUser) {
      throw new ApiError(404, "User not Found");
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, updatedUser, "user Profile Updated Successfully"),
      );
  } catch (error) {
    console.log("Inter Server Error", error);
    res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

export const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.userId;

    await User.findByIdAndDelete(userId);
    res.status(200).json({
      message: "User Account Deleted SuccessFully",
    });
  } catch (error) {
    console.log("Inter Server Error", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getAllUsers = async (_req, res) => {
  try {
    const users = await User.find().select(
      "- password -__v -createdAt -updatedAt",
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "No Users Found",
        error: "NoUsersFound",
      });
    } else {
      res.status(200).json({
        message: "Users Retrieved Successfully",
        data: users,
      });
    }
  } catch (error) {
    console.log("Inter Server Error", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

import crypto from "crypto";
import nodemailer from "nodemailer";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User with this email does not exist",
      });
    }

    // create reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // hash token before saving
    user.resetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    // send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset",
      html: `
        <h3>Password Reset Request</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `,
    });

    res.status(200).json({
      message: "Password reset link sent to email",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.userid;

    const { oldPassword, newPassword } = req.body;

    // console.log("REQ USER:", req.user, " ", req.user.userid);
    // console.log("USER ID : ", userId);

    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordCorrect) {
      throw new ApiError(400, "Incorrect Old Password");
    } else {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      await user.save();
      const data = { email: user.email };
      res
        .status(200)
        .json(new ApiResponse(200, data, "Password Changed Successfully"));
    }
  } catch (error) {
    console.log("Inter Server Error", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const logoutUser = async (_req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({
      message: "User Logged Out SuccessFully",
    });
  } catch (error) {
    console.log("Inter Server Error", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
