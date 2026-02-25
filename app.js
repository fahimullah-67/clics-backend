import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { userRouter } from "./src/routes/user.router.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());




app.get("/", (req, res) => {
  res.send("HOME PAGE");
});
app.use("/api/v1", userRouter)

export {app};