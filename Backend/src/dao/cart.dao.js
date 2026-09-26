import mongoose from "mongoose"
import cartModel from "../models/cart.model.js"


export async function getCartDetails(userId) {


    let cart = await cartModel.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId),
            },
        },

        {
            $unwind: {
                path: "$items",
            },
        },

        {
            $lookup: {
                from: "products",
                localField: "items.product",
                foreignField: "_id",
                as: "items.product",
            },
        },

        {
            $unwind: {
                path: "$items.product",
            },
        },

        {
            $unwind: {
                path: "$items.product.variants",
            },
        },

        {
            $match: {
                $expr: {
                    $eq: [
                        "$items.variant",
                        "$items.product.variants._id",
                    ],
                },
            },
        },

        {
            $addFields: {
                itemPrice: {
                    price: {
                        $multiply: [
                            "$items.quantity",
                            "$items.product.price.amount"
                        ],
                    },
                    currency:
                        "$items.product.price.currency",
                },
            },
        },

        {
            $group: {
                _id: "$_id",

                totalPrice: {
                    $sum: "$itemPrice.price",
                },

                currency: {
                    $first: "$itemPrice.currency",
                },

                items: {
                    $push: "$items",
                },
            },
        },
    ]);

    return cart

}