import dotenv from "dotenv";

dotenv.config();


if(!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in the environment variables.");
}

if(!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
}



export const config = {
    MONGODB_URI: process.env.MONGODB_URI ,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    NODE_ENV: process.env.NODE_ENV || "development",
}