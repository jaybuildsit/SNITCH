import { body, validationResult } from "express-validator";


function ValidateRequest(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ message: "validation Error", errors: errors.array() });
    }

    next();
}

export const createProductValidator = [

    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("priceAmount").isNumeric().withMessage("Price Amount must be numeric"),
    body("priceCurrency").notEmpty().withMessage("Price currency is required", ValidateRequest)

]