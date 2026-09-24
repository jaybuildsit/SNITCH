import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { validateAddToCart } from "../validator/cart.validator.js";
import { addToCart,getCart } from "../controllers/cart.controller.js";


const router = express.Router();



router.post("/add/:productId", authenticateUser, validateAddToCart,addToCart)
router.get('/',authenticateUser,getCart)

export default router;