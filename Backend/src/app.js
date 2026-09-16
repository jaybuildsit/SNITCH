import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5174",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
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

app.use("/api/auth", authRoutes);

export default app;