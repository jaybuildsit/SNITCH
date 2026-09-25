import mongoose from "mongoose";
import priceSchema from "./price.schema.js"

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
        type: priceSchema,
        required: true
    },
    images: [{
        url: {
            type: String,
            required: true
        },
    }],

    stock: {
        type: Number,
        default: 0
    },
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
                type: priceSchema,
                // required:true

            }
        }
    ]
}, { timestamps: true });

const productModel = mongoose.model("Product", productScheme);

export default productModel;
