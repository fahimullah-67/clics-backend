import fs from "fs";
import path from "path";
import DB_NAME from "../../constant.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

import Bank from "../models/bank.model.js";

dotenv.config();

const connectDB = async () => {
  try {
    const connectInstantDb = await mongoose.connect(
      `${process.env.DATABASE_URI}/${DB_NAME}`,
    );

    console.log(
      `Connect DB !! Connection HOST ", ${connectInstantDb.connection.host}`,
    );


    // console.log("Done ✅");
    // process.exit();

  } catch (error) {
    console.log("ERROR FROM DATABASE CONNECTION :: ", error);
    process.exit(1);
  }
};

export default connectDB;
