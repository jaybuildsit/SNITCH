import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Base Route
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Server is running smoothly",
  });
});

export default app;