import { body, validationResult } from "express-validator";


function validateRequest(req,res,next){
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    next(); 

}



export const registerValidator = [

    body("email").isEmail().withMessage("Please provide a valid email address."),
    body("contact").notEmpty().withMessage("Please provide a valid contact number.").matches(/^\d{10}$/).withMessage("Contact number must be 10 digits long."),
    body("password").isLength({ min: 4 }).withMessage("Password must be at least 4 characters long."),
    body("fullName").notEmpty().withMessage("Full name is required.").isLength({ min: 3 }).withMessage("Full name must be at least 3 characters long."),
    body("isSeller").optional().isBoolean().withMessage("isSeller must be a boolean value."),

    validateRequest


]
                                                           