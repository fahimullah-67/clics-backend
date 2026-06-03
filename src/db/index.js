import { app } from "../../app.js";
import DB_NAME from "../../constant.js";
import mongoose from "mongoose";

const port = process.env.PORT || 8000;
// const port = process.env.PORT || 8000;
// console.log("For Testing:   PORT Running On ", port);

let isConnected = false;

const connectDB = async () => {
  try {
    if (isConnected) {
      return;
    }

    //DATABASE Mongoose Connection
    // mongoose
    //   .connect(
    //     "mongodb+srv://FahimUllah:fahimclics@cluster0.iy0nrsc.mongodb.net/clics",
    //   )
    //   .then(() => console.log(" DataBase Connect"))
    //   .catch((err) => console.error("DB Error", err));

    const connectInstantDb = await mongoose.connect(
      `${process.env.DATABASE_URI}/${DB_NAME}`,
    );

    isConnected = connectInstantDb.connections[0].readyState;

    console.log(
      `Connect DB !! Connection HOST ", ${connectInstantDb.connection.host}`,
    );

    // ================== VERCEL CODE (COMMENTED) ==================
    // app.listen(port, () => {
    //   console.log(`CLICS Backend is Running on Port: http://localhost:${port}`);
    // });
    // export default app;
    // =============================================================
  } catch (error) {
    console.log("ERROR FROM DATABASE CONNECTION :: ", error);
    // process.exit(1);
  }
};

export default connectDB;