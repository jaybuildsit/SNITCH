import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

async function sendtokenResponse(user, res) {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    })

    res.status(200).json({
        token,user:{
            id:user._id,
            email:user.email,
            contact:user.contact,
            fullName:user.fullName,
            role:user.role
        }
    })


}

export const register = async (req, res) => {

    const { email, contact, password, fullName } = req.body;

    try {

        const existingUser = await userModel.findOne({
            $or: [
                { email: email },
                { contact: contact }
            ]
        })

        if (existingUser) {
            return res.status(400).json({ message: "User with this email or contact number already exists." });
        }

        const user = await userModel.create({
            email,
            contact,
            password,
            fullName

        })





    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }


}


