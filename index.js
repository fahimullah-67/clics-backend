// console.log("HELLO");

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/user.router.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
console.log("For Testing:   PORT Running On ", port);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("CLICS Backend is Running");
});
app.use("/allUser/", userRouter);


app.listen(port, () => {
    console.log(`CLICS Backend is Running on Port: http://localhost:${port}`);
})

