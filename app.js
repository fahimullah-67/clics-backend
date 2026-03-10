import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { userRouter } from "./src/routes/user.router.js";
import cookieParser from "cookie-parser";
import { bankRouter } from "./src/routes/bank.router.js";
import { loanSchemeRouter } from "./src/routes/loanScheme.router.js";
import { chatRouter } from "./src/routes/chat.router.js";
import WatchList from "./src/models/watchList.model.js";
import { snapshotRouter } from "./src/routes/snapshot.router.js";
import { comparisonRouter } from "./src/routes/comparsion.router.js";

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
app.use("/api/v1", userRouter);
app.use("/api/v1", bankRouter);
app.use("/api/v1/loanSchemes", loanSchemeRouter);
app.use("/api/v1", chatRouter);
app.use("/api/v1", WatchList);
app.use("/api/v1", snapshotRouter);
app.use("/api/v1", comparisonRouter);


export {app};