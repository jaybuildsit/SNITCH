import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockVariant } from "../dao/product.dao.js"

export const addToCart = async (req, res) => {

    const { productId, variantId } = req.params

    const { quantity = 1 } = req.body

    const product = await productModel.findOne({
        _id: productId,
        "variants._id": variantId
    })

    if (!product) {
        return res.status(400).json({
            message: "Product or  variant not Found!!!",
            success: false
        })
    }

    const stock = await stockVariant(productId, variantId)


    const cart = await cartModel.findOne({ user: req.user._id }) ||
        (await cartModel.create({ user: req.user._id }))


    const isProductAlreadyInCart = cart.items.some(item => item.product.toString() === productId && item.variant?.toString() === variantId)


    if (isProductAlreadyInCart) {
        const quantityInCart = cart.items.find(item => item.product.toString() === productId && item.variant?.toString() === variantId).quantity
        if (quantityInCart + quantity > stock) {
            return res.status(400).json({
                message: `Only ${stock} items left in stock. and you already have ${quantityInCart} items in your cart`,
                success: false
            })
        }

        await cartModel.findOneAndUpdate(
            { user: req.user._id, "items.product": productId, "items.variant": variantId },
            { $inc: { "items.$.quantity": quantity } },
            { new: true }
        )

        return res.status(200).json({
            message:"Cart Updated Successfully!!",
            success:true 
        })

    }

    if(quantity>stock){
        return res.status(400).json({
            message:`Only ${stock} items left in stock`,
            success:false
        })
    }

    cart.items.push({
        product:productId,
        variant:variantId,
        quantity,
        price:product.price 
    })

    await cart.save()


    return res.status(200).json({message:"Product added to cart successfully!!",
        success:true
    })


}