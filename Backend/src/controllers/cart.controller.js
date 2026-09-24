import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
// import { stockVariant } from "../dao/product.dao.js"

export const addToCart = async (req, res) => {
    const { productId } = req.params;
    const { variantId = null, quantity = 1 } = req.body;

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
            (item.variant?.toString() || null) === variantId
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
    const user = req.user

    let cart = await cartModel.findOne({ user: user._id }).populate("items.product")

    if (!cart) {
        cart = await cartModel.create({ user: user._id })
    }

    return res.status(200).json({
        message: "Cart Fetched Successfully",
        success: true,
        cart
    })
}