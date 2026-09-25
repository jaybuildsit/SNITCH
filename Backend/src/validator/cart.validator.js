import { param, body, validationResult } from "express-validator";



const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next();
}

export const validateAddToCart = [
    param("productId").isMongoId().withMessage("Invalid ProductID"),
    body("variantId")
        .optional({ values: "null" })
        .isMongoId()
        .withMessage("Invalid VariantId"),
    body("size")
    .optional({ values: "null" })
    .isString()
    .notEmpty()
    .withMessage("Size is required"),
    body("quantity").optional().isInt({ min: 1 }).withMessage("Quantity must be atleast 1"),
    validateRequest
]

