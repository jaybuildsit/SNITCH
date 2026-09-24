import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import productRouter from "./routes/product.routes.js"
import cartRouter from "./routes/cart.routes.js"
import cors from "cors";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "./config/config.js";





// const passport = require('passport');

const app = express();

app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(passport.initialize());
console.log("GOOGLE CALLBACK:", config.GOOGLE_CALLBACK_URL);
passport.use(new GoogleStrategy(
  {
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.GOOGLE_CALLBACK_URL,
  },
  (accessToken, refreshToken, profile, done) => {
    console.log("Google profile:", profile);
    return done(null, profile);
  }
));


// Base Route
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Server is running smoothly",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);



export default app;