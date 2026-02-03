import { app } from "../../app.jsx";
import { DB_NAME } from "../../constant.js";
import mongoose from "mongoose";


const port = process.env.PORT || 8000;
console.log("For Testing:   PORT Running On ", port);

const connectDB = async () => {
  try {
    //DATABASE Mongoose Connection
    const connectInstantDb = await mongoose.connect(
      `$process.env.DATABASE_URI/${DB_NAME}`,
    );
    console.log(
      `Connect DB !! Connection HOST ", connectInstantDb.connection.host`,
    );

    app.listen(port, () => {
      console.log(`CLICS Backend is Running on Port: http://localhost:${port}`);
    });


  } catch (error) {
    console.log("ERROR FROM DATABASE CONNECTION :: ", error);
    process.exit(1);
  }
};

export default connectDB;
