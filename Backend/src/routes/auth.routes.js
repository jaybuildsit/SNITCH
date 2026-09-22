import jwt from "jsonwebtoken";
import { Router } from "express";
import { registerValidator, loginValidator } from "../validator/auth.validator.js";
import { googleCallback, register, login, getMe } from "../controllers/auth.controller.js";
import passport from "passport";
import { config } from "../config/config.js";
import { authenticateUser } from "../middleware/auth.middleware.js";





const router = Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false, failureRedirect:config.NODE_ENV === "development" ? "http://localhost:5173/login" : "/login",
  }),
  (req, res) => {
    const token = jwt.sign(
      {
        id: req.user.id,
        displayName: req.user.displayName,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect("http://localhost:5173/",);
  }
);


router.get("/getme",authenticateUser,getMe)





export default router;