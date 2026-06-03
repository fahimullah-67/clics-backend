import connectBD from "./src/db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectBD().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`CLICS Backend is Running on Port: http://localhost:${PORT}`);
  });
});