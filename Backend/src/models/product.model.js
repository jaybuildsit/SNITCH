import mongoose from "mongoose";


const productScheme = new mongoose.Schema({

    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },

    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    price: {
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            required: true,
            enum: ["INR", "USD", "EUR", "GBP", "INR", "JPY", "CNY"], default: "INR" // Add more currencies as needed
        },



    },

    images: [{
        url: {
            type: String,
            required: true
        },
        alt: {
            type: String,
            required: true
        }
    }]

},{timestamps: true});


const productModel=mongoose.model("Product",productScheme);

export default productModel;