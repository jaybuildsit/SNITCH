import mongoose from "mongoose";

import { config } from "./config.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/snitch"
    );
    console.log(` MongoDB Connected! DB Host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error(" MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;

