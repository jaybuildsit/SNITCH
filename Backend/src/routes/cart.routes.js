import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { validateAddToCart } from "../validator/cart.validator.js";
import { addToCart,getCart,updateCartItem,removeCartItem, createOrderController } from "../controllers/cart.controller.js";


const router = express.Router();



router.post("/add/:productId", authenticateUser, validateAddToCart,addToCart)
router.get('/',authenticateUser,getCart)
router.patch(
    "/update/:itemId",
    authenticateUser,
    updateCartItem
);
router.delete(
    "/remove/:itemId",
    authenticateUser,
    removeCartItem
);

router.post('/payment/create/order',authenticateUser,createOrderController)

router.post('/payment/verify/order',authenticateUser,)

export default router;