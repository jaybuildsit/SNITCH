import express from "express";

import { authenticateSeller } from "../middleware/auth.middleware.js"
import { createProduct, getSellerProducts, deleteProduct, getAllProducts , getProductById } from "../controllers/product.controller.js";
import multer from "multer";
import { createProductValidator } from "../validator/product.validator.js";



const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

// import {Router} from "express";

const router = express.Router();


router.get("/seller", authenticateSeller, getSellerProducts)


router.post("/", authenticateSeller, createProductValidator, upload.array('images', 7), createProduct)
router.delete(
    "/:productId",
    authenticateSeller,
    deleteProduct
)

router.get("/:productId", getProductById);
router.get('/',getAllProducts)



export default router;



