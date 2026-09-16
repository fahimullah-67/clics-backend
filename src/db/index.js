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

    const connectInstantDb = await mongoose.connect(
      `${process.env.DATABASE_URI}/${DB_NAME}`,
    );

    isConnected = connectInstantDb.connections[0].readyState;

    console.log(
      `Connect DB !! Connection HOST ", ${connectInstantDb.connection.host}`,
    );

   
    
  } catch (error) {
    console.log("ERROR FROM DATABASE CONNECTION :: ", error);
    process.exit(1);
  }
};

export default connectDB;