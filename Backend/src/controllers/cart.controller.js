import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import mongoose from "mongoose"
// import { stockVariant } from "../dao/product.dao.js"

export const addToCart = async (req, res) => {
    const { productId } = req.params;
    const { variantId = null, size, quantity = 1 } = req.body;

    const product = await productModel.findById(productId);

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
            success: false,
        });
    }

    let variant = null;
    let stock = null;

    if (variantId) {
        variant = product.variants?.id(variantId);

        if (!variant) {
            return res.status(400).json({
                message: "Variant not found",
                success: false,
            });
        }

        stock = variant.stock ?? 0;

        if (stock <= 0) {
            return res.status(400).json({
                message: "Product is out of stock",
                success: false,
            });
        }

        if (quantity > stock) {
            return res.status(400).json({
                message: `Only ${stock} items left in stock`,
                success: false,
            });
        }
    }

    const cart =
        (await cartModel.findOne({ user: req.user._id })) ||
        (await cartModel.create({ user: req.user._id }));

    const existingItem = cart.items.find(
        (item) =>
            item.product.toString() === productId &&
            (item.variant?.toString() || null) === (variantId || null) &&
            item.size === size
    );

    if (existingItem) {
        if (
            variantId &&
            existingItem.quantity + quantity > stock
        ) {
            return res.status(400).json({
                message: `Only ${stock} items left in stock. You already have ${existingItem.quantity} in your cart`,
                success: false,
            });
        }

        existingItem.quantity += quantity;

        await cart.save();

        return res.status(200).json({
            message: "Cart Updated Successfully!!",
            success: true,
            cart,
        });
    }

    cart.items.push({
        product: productId,
        variant: variantId || undefined,
        size,
        quantity,
        price: product.price,
    });

    await cart.save();

    return res.status(200).json({
        message: "Product added to cart successfully!!",
        success: true,
        cart,
    });
};



export const getCart = async (req, res) => {
    try {
        const user = req.user;

        let cart = await cartModel.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(user._id),
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

        // Aggregation returns an array
        if (!cart.length) {
            cart = await cartModel.create({
                user: user._id,
            });
        } else {
            cart = cart[0];
        }

        console.log(
            "CART ITEMS:",
            cart.items?.map((item) => ({
                product: item.product?.title,
                variant: item.variant,
                size: item.size,
            }))
        );

        return res.status(200).json({
            message: "Cart Fetched Successfully",
            success: true,
            cart,
        });

    } catch (error) {
        console.error("GET CART ERROR:", error);

        return res.status(500).json({
            message: "Failed to fetch cart",
            success: false,
            error: error.message,
        });
    }
};


export const updateCartItem = async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
        return res.status(400).json({
            message: "Quantity must be at least 1",
            success: false,
        });
    }

    const cart = await cartModel.findOne({
        user: req.user._id,
    });

    if (!cart) {
        return res.status(404).json({
            message: "Cart not found",
            success: false,
        });
    }

    const cartItem = cart.items.id(itemId);

    if (!cartItem) {
        return res.status(404).json({
            message: "Cart item not found",
            success: false,
        });
    }

    // Normal product
    if (!cartItem.variant) {
        cartItem.quantity = quantity;

        await cart.save();

        return res.status(200).json({
            message: "Cart quantity updated successfully",
            success: true,
            cart,
        });
    }

    // Variant product
    const product = await productModel.findById(cartItem.product);

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
            success: false,
        });
    }

    const variant = product.variants?.id(cartItem.variant);

    if (!variant) {
        return res.status(400).json({
            message: "Variant not found",
            success: false,
        });
    }

    const stock = variant.stock ?? 0;

    if (stock <= 0) {
        return res.status(400).json({
            message: "Product is out of stock",
            success: false,
        });
    }

    if (quantity > stock) {
        return res.status(400).json({
            message: `Only ${stock} items left in stock`,
            success: false,
        });
    }

    cartItem.quantity = quantity;

    await cart.save();

    return res.status(200).json({
        message: "Cart quantity updated successfully",
        success: true,
        cart,
    });
};

export const removeCartItem = async (req, res) => {
    const { itemId } = req.params;

    const cart = await cartModel.findOne({
        user: req.user._id,
    });

    if (!cart) {
        return res.status(404).json({
            message: "Cart not found",
            success: false,
        });
    }

    const cartItem = cart.items.id(itemId);

    if (!cartItem) {
        return res.status(404).json({
            message: "Cart item not found",
            success: false,
        });
    }

    cartItem.deleteOne();

    await cart.save();

    return res.status(200).json({
        message: "Cart item removed successfully",
        success: true,
        cart,
    });
};

