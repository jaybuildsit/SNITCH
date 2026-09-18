import { userModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";




async function sendtokenResponse(user, res, message) {
    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
        message,
        success: true,
        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullName: user.fullName,
            role: user.role,
        },
    });
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
            contact: {
                number: contact,
                country: "IN",
            },
            password,
            fullName,
            role: isSeller ? "seller" : "buyer",
        });

        await sendtokenResponse(user, res, "User registered successfully");



    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }


}

export const login = async (req, res) => {

    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }


    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    await sendtokenResponse(user, res, "Login successful");

}


export const googleCallback = async (req, res) => {

    const { id, displayName, emails } = req.user;

    res.redirect("http://localhost:5173/");

    let user = await userModel.findOne({ email });

    if (!user) {
        const newUser = await userModel.create({
            emails,
            googleId: id,
            fullName: displayName,

        })

        const token = jwt.sign({
            id: user._id,
        },
            config.JWT_SECRET, {
            expiresIn: "7d"
        }
        )

        res.cookie("token", token)

        res.redirect("http://localhost:5173/");


        await sendtokenResponse(newUser, res, "User registered and logged in successfully");
    } else {
        await sendtokenResponse(user, res, "User logged in successfully");
    }
}