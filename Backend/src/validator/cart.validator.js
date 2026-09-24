import { param, body ,validationResult } from "express-validator";



const validateRequest=(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    next();
}

export const validateAddToCart=[
    param("productId").isMongoId().withMessage("Invalid ProductID"),
    param("variantId").optional().isMongoId().withMessage("Invalid VariantId"),
    body("quantity").optional().isInt({min:1}).withMessage("Quantity must be atleast 1"),
    validateRequest
]