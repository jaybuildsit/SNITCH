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
            enum: ["INR", "USD", "EUR", "GBP", "JPY", "CNY"],
            default: "INR"
        },
    },
    images: [{
        url: {
            type: String,
            required: true
        },
    }],
    variants: [
        {
            sku: {
                type: String,
                sparse: true
            },
            images: [
                {
                    url: {
                        type: String,
                        required: true
                    }
                }
            ],
            attributes: {
                type: Map,
                of: String
            },
            stock: {
                type: Number,
                default: 0
            },
            sizes: {
                type: Map,
                of: Number
            },
            price: {
                amount: {
                    type: Number,
                    required: false
                },
                currency: {
                    type: String,
                    enum: ["USD", "EUR", "GBP", "INR", "JPY"],
                    default: "INR"
                }
            }
        }
    ]
}, { timestamps: true });

const productModel = mongoose.model("Product", productScheme);

export default productModel;
