import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/db/db.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(` Server is running on port: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(" Server startup failed:", error.message);
  });