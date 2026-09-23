import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export async function createProduct(req, res) {
    const { title, description, priceAmount, priceCurrency } = req.body;
    const seller = req.user;

    const images = await Promise.all(
        req.files.map(async (file) => {
            return await uploadFile({
                buffer: file.buffer,
                fileName: file.originalname,
            });
        })
    );

    const product = await productModel.create({
        title,
        description,
        price: {
            amount: priceAmount,
            currency: priceCurrency,
        },
        images,
        seller: seller._id,
    });

    res.status(201).json({ message: "Product Created Successfully!!!", success: true, product });
}

export async function getSellerProducts(req, res) {
    const seller = req.user;
    const products = await productModel.find({ seller: seller._id });

    res.status(200).json({
        message: "Product Fetched Successfully",
        success: true,
        products,
    });
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
    const products = await productModel.find();
    return res.status(200).json({ message: "Products Fetched Successfully!!", success: true, products });
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

export async function updateProduct(req, res) {
    const seller = req.user;
    const { productId } = req.params;

    const {
        title,
        description,
        price,
        variants,
    } = req.body;

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

    if (title !== undefined) product.title = title;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (variants !== undefined) product.variants = variants;

    await product.save();

    return res.status(200).json({
        message: "Product updated successfully",
        success: true,
        product,
    });
}

export async function uploadProductImage(req, res) {
    try {
        const file = req.file || (req.files && req.files[0]);
        if (!file) {
            return res.status(400).json({
                message: "No image file provided",
                success: false,
            });
        }

        const uploaded = await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname,
        });

        return res.status(200).json({
            message: "Image uploaded successfully",
            success: true,
            imageUrl: uploaded.url,
            image: { url: uploaded.url },
        });
    } catch (error) {
        console.error("Image upload failed:", error);
        return res.status(500).json({
            message: error.message || "Failed to upload image",
            success: false,
        });
    }
}
