import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import mongoose from "mongoose"
import { createOrder } from "../services/payment.service.js";
import { getCartDetails } from "../dao/cart.dao.js"
import paymentModel from "../models/payment.model.js"
import { validatePaymentverification } from "../node_modules/razorpay/dist/utils/razorpay-utils.js"
import { config } from "dotenv";





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

        let cart = await getCartDetails(user._id)



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

export const createOrderController = async (req, res) => {
    try {
        let cart = await getCartDetails(req.user._id);

        if (!cart.length) {
            return res.status(400).json({
                message: "Cart is empty",
                success: false,
            });
        }

        cart = cart[0];

        const order = await createOrder({
            amount: cart.totalPrice,
            currency: cart.currency,
        });

        const payment = await paymentModel.create({
            user: req.user._id,
            razorpay: {
                orderId: order.id,
            },
            price: {
                amount: cart.totalPrice,
                currency: cart.currency
            },
            orderItems: cart.items.map(item => ({
                title: item.product.title,
                productId: item.product._id,
                variantId: item.variant,
                quantity: item.quantity,
                images: item.product.variants.images || item.product.images,
                description: item.product.description,
                price: {
                    amount: item.product.price.amount || item.product.price.amount,
                    currency: item.product.price.currency || item.price.currency
                }
            }))
        })

        return res.status(200).json({
            message: "Order Created Successfully!!",
            success: true,
            order,
        });

    } catch (error) {
        console.error("CREATE ORDER ERROR:", error);

        return res.status(500).json({
            message: "Failed to create order",
            success: false,
            error: error.message,
        });
    }
};

export const verifyOrderController = async (req, res) => {

    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body

    const payment = await paymentModel.findOne({
        "razorpay.orderId": razorpay_order_id,
        status: "pending"
    })


    if (!payment) {
        return res.status(400).json({
            message: "Payment not found",
            success: false
        })
    }

    const isPaymentValid = validatePaymentverification({
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
    }, razorpay_signature, config.RAZORPAY_KEY_SECRET)

    if


}



