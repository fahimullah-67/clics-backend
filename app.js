import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { userRouter } from "./src/routes/user.router.js";
import cookieParser from "cookie-parser";
import { bankRouter } from "./src/routes/bank.router.js";
import { loanSchemeRouter } from "./src/routes/loanScheme.router.js";
import { chatRouter } from "./src/routes/chat.router.js";
import { snapshotRouter } from "./src/routes/snapshot.router.js";
import { comparisonRouter } from "./src/routes/comparison.router.js";
import { watchlistRouter } from "./src/routes/watchlist.router.js";
import { notificationRouter } from "./src/routes/notification.router.js";
import { adminRouter } from "./src/routes/admin.route.js";
import { adminLogsRouter } from "./src/routes/adminLogs.route.js";
import { scraperRouter } from "./src/routes/scraper.router.js";
// import { createServer } from "http";
// import notificationService from "./src/utils/realTimeNotificationService.js";

dotenv.config();

const app = express();
// const httpServer = createServer(app);

// Initialize Socket.io for real-time notifications
// notificationService.initialize(httpServer);

app.use(
  cors({
    origin: [
      "http://localhost:7000", // local
      "https://clics.vercel.app", // production frontend
    ],
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
app.use("/api/v1/schemes", comparisonRouter);
app.use("/api/v1/watchlist", watchlistRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/adminLogs", adminLogsRouter);
app.use("/api/v1/scraper", scraperRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1", snapshotRouter);


// httpServer.listen(process.env.PORT || 5000, () => {
//   console.log(`Server running on port ${process.env.PORT || 5000}`);  
// });

export {app};