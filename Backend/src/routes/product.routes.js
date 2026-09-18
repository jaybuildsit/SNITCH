import express from "express";

import {authenticateSeller} from "../middleware/auth.middleware.js"
import { createProduct } from "../controllers/product.controller.js";

// import {Router} from "express";

const router = express.Router();


router.post("/",authenticateSeller,createProduct)

export default router;



