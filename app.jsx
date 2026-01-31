import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { userRouter } from "./routes/user.router";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json())
app.use(cookieParser())

app.use("/api/v1", userRouter)

export {app};