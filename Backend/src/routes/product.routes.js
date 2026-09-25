import express from "express";
import { authenticateSeller } from "../middleware/auth.middleware.js";
import {
    createProduct,
    getSellerProducts,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    uploadProductImage,
} from "../controllers/product.controller.js";
import multer from "multer";
import { createProductValidator } from "../validator/product.validator.js";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

const router = express.Router();

router.get("/seller", authenticateSeller, getSellerProducts);
router.post(
    "/",
    (req, res, next) => {
        console.log("🔥 PRODUCT ROUTE HIT");
        next();
    },
    authenticateSeller,
    upload.array("images", 30),
    createProductValidator,
    createProduct
);
router.post("/upload-image", authenticateSeller, upload.single("image"), uploadProductImage);
router.delete("/:productId", authenticateSeller, deleteProduct);
router.put("/:productId", authenticateSeller, updateProduct);
router.get("/:productId", getProductById);
router.get("/", getAllProducts);

export default router;
