import { userModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

async function sendtokenResponse(user, res, message) {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    })


    res.cookie("token", token,)

    res.status(200).json({
        message,
        success: true,
        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullName: user.fullName,
            role: user.role
        }
    })


}

export const register = async (req, res) => {

    const { email, contact, password, fullName, isSeller } = req.body;

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
            fullName,
            role: isSeller ? "seller" : "buyer"

        })

        await sendtokenResponse(user, res, "User registered successfully");



    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }


}


//Changes to be made in the login function to send token in cookie and response body