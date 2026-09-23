import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js"

export async function createProduct(req, res) {

    const { title, description, priceAmount, priceCurrency } = req.body;

    const seller = req.user;

    const images = await Promise.all(req.files.map(async (file) => {
        return await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname
        })
    }))


    const product = await productModel.create({
        title,
        description,
        price: {
            amount: priceAmount,
            currency: priceCurrency
        },
        images, seller: seller._id

    })

    res.status(201).json({ message: "Product Created Successfully!!!", success: true, product })





}


export async function getSellerProducts(req, res) {

    const seller = req.user;

    const products = await productModel.find({ seller: seller._id });


    res.status(201).json({

        message: "Product Fetched Successfully",
        success: true,
        products

    })



}

export async function deleteProduct(req, res) {
    const seller = req.user;
    const { productId } = req.params;

    const product = await productModel.findOne({
        _id: productId,
        seller: seller._id,
    });

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
            success: false,
        });
    }

    await productModel.findByIdAndDelete(productId);

    res.status(200).json({
        message: "Product deleted successfully",
        success: true,
    });
}


export async function getAllProducts(req, res) {
    const products = await productModel.find()

    return res.status(200).json({ message: "Products Fetched Successfully!!", success: true, products })
}    

export async function getProductById(req, res) {
    const { productId } = req.params;

    const product = await productModel.findById(productId);

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
            success: false,
        });
    }

    return res.status(200).json({
        message: "Product Fetched Successfully",
        success: true,
        product,
    });
}