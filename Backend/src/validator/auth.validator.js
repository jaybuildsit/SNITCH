import { body, validationResult } from "express-validator";

export const registerValidator = [

    body("email").isEmail().withMessage("Please provide a valid email address."),
    body("contact").notEmpty().withMessage("Please provide a valid contact number.").length({ min: 10, max: 10 }).withMessage("Contact number must be 10 digits long."),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long."),
    body("fullName").notEmpty().withMessage("Full name is required."),
]
