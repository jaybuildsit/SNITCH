import express from "express";
import { authenticateUser } from "../middleware/auth.middleware";
import { validateAddToCart } from "../validator/cart.validator.js";
import { addToCart } from "../controllers/cart.controller.js";


const router = express.Router();



router.post("/add/:productId/:variantId", authenticateUser, validateAddToCart,addToCart)

export default router;