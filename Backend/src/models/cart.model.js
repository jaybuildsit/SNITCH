import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        variant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product.variant'
        },
        size: {
            type: String
        },
        quantity: {
            type: Number,
            default: 1
        },
        price: {
            amount: {
                type: Number,
                required: true
            },
            currency: {
                type: String,
                enum: ["USD", "INR", "EUR", "GBP", "JPY"],
                default: "INR"
            }
        }

    }]

})



const cartModel = mongoose.model("cart", cartSchema);


export default cartModel