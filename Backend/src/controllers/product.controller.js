import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export async function createProduct(req, res) {
    console.log("🔥 CREATE PRODUCT CONTROLLER HIT");

    try {
        const {
            title,
            description,
            priceAmount,
            priceCurrency,
            stock,
            sizes: sizesJson,
            variants: variantsJson,
            productImageCount,
            variantImageCounts,
        } = req.body;

        console.log("🔥🔥 SIZES RECEIVED BY BACKEND:", req.body.sizes);
        console.log("🔥🔥 FULL BODY:", req.body);

        
        const seller = req.user;

        let variants = [];

        if (variantsJson) {
            try {
                variants = JSON.parse(variantsJson);
            } catch (error) {
                return res.status(400).json({
                    message: "Invalid variants data",
                    success: false,
                });
            }
        }
        let sizes = {};

        if (sizesJson) {
            try {
                sizes = JSON.parse(sizesJson);
            } catch (error) {
                return res.status(400).json({
                    message: "Invalid sizes data",
                    success: false,
                });
            }
        }




        const productImagesCount =
            Number(productImageCount) || 0;

        let imageCounts = [];

        if (variantImageCounts) {
            try {
                imageCounts = JSON.parse(variantImageCounts);
            } catch (error) {
                return res.status(400).json({
                    message: "Invalid variant image data",
                    success: false,
                });
            }
        }

        console.log("🔥 FILE COUNT:", req.files?.length || 0);
        console.log("🔥 STARTING IMAGE UPLOADS");

        const uploadedImages = await Promise.all(
            (req.files || []).map(async (file) => {
                console.log("📤 Uploading:", file.originalname);

                const result = await uploadFile({
                    buffer: file.buffer,
                    fileName: file.originalname,
                });

                console.log("✅ Uploaded:", file.originalname);

                return result;
            })
        );

        console.log("🔥 ALL IMAGES UPLOADED");

        // --------------------------------
        // Product images
        // --------------------------------

        let imageIndex = 0;

        const productImages = uploadedImages
            .slice(
                imageIndex,
                imageIndex + productImagesCount
            )
            .map((image) => ({
                url: image.url,
            }));

        imageIndex += productImagesCount;

        // --------------------------------
        // Variant images + variants
        // --------------------------------

        const preparedVariants = [];

        for (
            let groupIndex = 0;
            groupIndex < variants.length;
            groupIndex++
        ) {
            const group = variants[groupIndex];

            const count =
                Number(imageCounts[groupIndex]) || 0;

            const variantImages = uploadedImages
                .slice(
                    imageIndex,
                    imageIndex + count
                )
                .map((image) => ({
                    url: image.url,
                }));

            imageIndex += count;

            if (
                Array.isArray(group.sizes) &&
                group.sizes.length > 0
            ) {
                group.sizes.forEach(({ size, stock }) => {
                    preparedVariants.push({
                        attributes: {
                            color: group.color || "",
                            size: size || "",
                        },

                        stock: Number(stock) || 0,

                        images: variantImages,
                    });
                });

                continue;
            }

            preparedVariants.push({
                attributes: {
                    color: group.color || "",
                },

                stock: Number(group.stock) || 0,

                images: variantImages,
            });
        }

        // --------------------------------
        // Create product ONCE
        // --------------------------------

        const product = await productModel.create({
            title,
            description,
            price: {
                amount: Number(priceAmount),
                currency: priceCurrency,
            },
            stock: Number(stock) || 0,
            sizes,
            images: productImages,
            variants: preparedVariants,
            seller: seller._id,
        });

        console.log("✅ PRODUCT CREATED:", product._id);

        return res.status(201).json({
            message: "Product Created Successfully!!!",
            success: true,
            product,
        });

    } catch (error) {
        console.error("❌ CREATE PRODUCT ERROR:", error);

        return res.status(500).json({
            message:
                error.message ||
                "Failed to create product",
            success: false,
        });
    }
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

    console.log("🔥 PRODUCT FROM DATABASE:", product);
    console.log("🔥 PRODUCT SIZES FROM DATABASE:", product?.sizes);

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

    if (title !== undefined) {
        product.title = title;
    }

    if (description !== undefined) {
        product.description = description;
    }

    if (price !== undefined) {
        product.price = price;
    }

    if (variants !== undefined) {
        product.variants = variants.map((variant) => ({
            ...variant,
            attributes: new Map(
                Object.entries(variant.attributes || {})
            ),
        }));
    }

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
