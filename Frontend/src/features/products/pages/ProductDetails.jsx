import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        handleGetProductById,
        handleGetAllProducts,
    } = useProduct();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [activeImage, setActiveImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    const sizes = ["S", "M", "L", "XL"];

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);

                const productData = await handleGetProductById(id);

                setProduct(productData);

                // Fetch all products for related products
                const allProducts = await handleGetAllProducts();

                const related = allProducts
                    .filter((item) => item._id !== id)
                    .slice(0, 4);

                setRelatedProducts(related);

            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const getImageUrl = (image) => {
        if (!image) return "";

        if (typeof image === "string") {
            return image;
        }

        return (
            image.url ||
            image.fileUrl ||
            image.thumbnailUrl ||
            image.src ||
            ""
        );
    };

    const increaseQuantity = () => {
        setQuantity((prev) => prev + 1);
    };

    const decreaseQuantity = () => {
        setQuantity((prev) => Math.max(1, prev - 1));
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Please select a size");
            return;
        }

        console.log("ADD TO CART", {
            productId: product._id,
            size: selectedSize,
            quantity,
        });
    };

    const handleBuyNow = () => {
        if (!selectedSize) {
            alert("Please select a size");
            return;
        }

        console.log("BUY NOW", {
            productId: product._id,
            size: selectedSize,
            quantity,
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <p className="text-sm tracking-[0.25em] uppercase text-gray-500">
                    Loading...
                </p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <p className="text-xl font-medium">
                    Product not found
                </p>
            </div>
        );
    }

    const images = product.images || [];

    const price = product.price?.amount || 0;

    const currency = product.price?.currency || "INR";

    const formattedPrice = new Intl.NumberFormat("en-IN").format(price);

    return (
        <div className="min-h-screen bg-white text-black">

            {/* =========================================
                PRODUCT SECTION
            ========================================= */}

            <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10">

                <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16">

                    {/* =================================
                        LEFT - IMAGE GALLERY
                    ================================= */}

                    <div className="flex gap-4">

                        {/* THUMBNAILS */}

                        <div className="w-[85px] flex flex-col gap-3">

                            {images.slice(0, 7).map((image, index) => {

                                const imageUrl = getImageUrl(image);

                                return (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            setActiveImage(index)
                                        }
                                        className={`
                                            w-[82px]
                                            h-[105px]
                                            rounded-xl
                                            overflow-hidden
                                            bg-[#f5f5f5]
                                            border
                                            transition-all
                                            duration-200
                                            ${
                                                activeImage === index
                                                    ? "border-black"
                                                    : "border-transparent hover:border-gray-400"
                                            }
                                        `}
                                    >

                                        <img
                                            src={imageUrl}
                                            alt={`${product.title}-${index}`}
                                            className="w-full h-full object-cover"
                                        />

                                    </button>
                                );
                            })}

                        </div>

                        {/* MAIN IMAGE */}

                        <div className="flex-1">

                            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#f5f5f5]">

                                {images.length > 0 ? (
                                    <img
                                        src={getImageUrl(
                                            images[activeImage]
                                        )}
                                        alt={product.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}

                                {/* IMAGE COUNT */}

                                {images.length > 1 && (
                                    <div className="absolute bottom-4 right-4 bg-black text-white text-xs px-3 py-2 rounded-full">
                                        {activeImage + 1} / {images.length}
                                    </div>
                                )}

                            </div>

                        </div>

                    </div>

                    {/* =================================
                        RIGHT - PRODUCT INFORMATION
                    ================================= */}

                    <div className="pt-2">

                        {/* BRAND */}

                        <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-3">
                            SNITCH
                        </p>

                        {/* TITLE */}

                        <h1 className="text-4xl lg:text-5xl font-medium tracking-tight">
                            {product.title}
                        </h1>

                        {/* PRICE */}

                        <div className="mt-5">

                            <span className="text-3xl font-semibold">
                                {currency === "INR"
                                    ? `₹${formattedPrice}`
                                    : `${currency} ${formattedPrice}`}
                            </span>

                        </div>

                        {/* DESCRIPTION */}

                        <div className="mt-7">

                            <h2 className="text-sm font-semibold mb-3">
                                Description
                            </h2>

                            <p className="text-sm leading-6 text-gray-600 max-w-xl">
                                {product.description}
                            </p>

                        </div>

                        {/* SIZE */}

                        <div className="mt-8">

                            <div className="flex items-center justify-between mb-4">

                                <h2 className="text-sm font-semibold">
                                    Size
                                </h2>

                                <button className="text-xs underline text-gray-500 hover:text-black">
                                    Size Guide
                                </button>

                            </div>

                            <div className="flex gap-3">

                                {sizes.map((size) => (

                                    <button
                                        key={size}
                                        onClick={() =>
                                            setSelectedSize(size)
                                        }
                                        className={`
                                            w-14
                                            h-14
                                            rounded-lg
                                            border
                                            text-sm
                                            font-medium
                                            transition-all
                                            duration-200

                                            ${
                                                selectedSize === size
                                                    ? "bg-black text-white border-black"
                                                    : "bg-white text-black border-gray-300 hover:bg-black hover:text-white hover:border-black"
                                            }
                                        `}
                                    >
                                        {size}
                                    </button>

                                ))}

                            </div>

                        </div>

                        {/* QUANTITY */}

                        <div className="mt-8">

                            <h2 className="text-sm font-semibold mb-4">
                                Quantity
                            </h2>

                            <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden">

                                <button
                                    onClick={decreaseQuantity}
                                    className="w-12 h-12 text-lg hover:bg-black hover:text-white transition"
                                >
                                    −
                                </button>

                                <span className="w-12 text-center text-sm">
                                    {quantity}
                                </span>

                                <button
                                    onClick={increaseQuantity}
                                    className="w-12 h-12 text-lg hover:bg-black hover:text-white transition"
                                >
                                    +
                                </button>

                            </div>

                        </div>

                        {/* ACTION BUTTONS */}

                        <div className="mt-8 grid grid-cols-2 gap-3">

                            <button
                                onClick={handleAddToCart}
                                className="
                                    h-14
                                    rounded-full
                                    border
                                    border-black
                                    bg-white
                                    text-black
                                    font-medium
                                    hover:bg-black
                                    hover:text-white
                                    transition-all
                                "
                            >
                                Add To Cart
                            </button>

                            <button
                                onClick={handleBuyNow}
                                className="
                                    h-14
                                    rounded-full
                                    bg-black
                                    text-white
                                    font-medium
                                    hover:bg-[#222]
                                    transition-all
                                "
                            >
                                Checkout Now
                            </button>

                        </div>

                        {/* BENEFITS */}

                        <div className="grid grid-cols-3 gap-4 mt-8 py-6 border-y border-gray-200">

                            <div>
                                <p className="text-sm font-medium">
                                    Free Shipping
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                    On all orders
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium">
                                    Easy Returns
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                    Hassle-free returns
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium">
                                    Secure Payment
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                    100% secure
                                </p>
                            </div>

                        </div>

                        {/* ACCORDIONS */}

                        <div className="mt-2">

                            {[
                                "Product Details",
                                "Shipping & Returns",
                                "Care Instructions",
                            ].map((item) => (

                                <button
                                    key={item}
                                    className="
                                        w-full
                                        flex
                                        justify-between
                                        items-center
                                        py-5
                                        border-b
                                        border-gray-200
                                        text-sm
                                        font-medium
                                        text-left
                                        hover:text-gray-500
                                        transition
                                    "
                                >

                                    <span>
                                        {item}
                                    </span>

                                    <span className="text-xl font-light">
                                        +
                                    </span>

                                </button>

                            ))}

                        </div>

                    </div>

                </div>

            </section>

            {/* =========================================
                RELATED PRODUCTS
            ========================================= */}

            <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16">

                <div className="flex items-center justify-between mb-8">

                    <h2 className="text-3xl font-medium tracking-tight">
                        This item can be cool with this
                    </h2>

                    <button className="hidden sm:block text-sm underline">
                        View All →
                    </button>

                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

                    {relatedProducts.map((item) => {

                        const imageUrl =
                            getImageUrl(item.images?.[0]);

                        return (
                            <article
                                key={item._id}
                                onClick={() =>
                                    navigate(
                                        `/products/${item._id}`
                                    )
                                }
                                className="
                                    group
                                    cursor-pointer
                                "
                            >

                                {/* IMAGE */}

                                <div className="
                                    relative
                                    aspect-[4/5]
                                    rounded-xl
                                    overflow-hidden
                                    bg-[#f5f5f5]
                                ">

                                    <img
                                        src={imageUrl}
                                        alt={item.title}
                                        className="
                                            w-full
                                            h-full
                                            object-cover
                                            transition-transform
                                            duration-500
                                            group-hover:scale-105
                                        "
                                    />

                                    {/* BAG BUTTON */}

                                    <button
                                        onClick={(e) =>
                                            e.stopPropagation()
                                        }
                                        className="
                                            absolute
                                            bottom-4
                                            right-4
                                            w-10
                                            h-10
                                            rounded-full
                                            bg-white
                                            flex
                                            items-center
                                            justify-center
                                            shadow-sm
                                            hover:bg-black
                                            hover:text-white
                                            transition
                                        "
                                    >
                                        🛍
                                    </button>

                                </div>

                                {/* INFO */}

                                <div className="mt-4">

                                    <p className="text-sm font-medium">
                                        {item.title}
                                    </p>

                                    <p className="text-xs text-gray-500 mt-1">
                                        SNITCH
                                    </p>

                                    <p className="text-sm font-semibold mt-2">
                                        {item.price?.currency === "INR"
                                            ? `₹${new Intl.NumberFormat("en-IN").format(
                                                item.price?.amount || 0
                                            )}`
                                            : `${item.price?.currency || ""} ${item.price?.amount || 0}`
                                        }
                                    </p>

                                </div>

                            </article>
                        );
                    })}

                </div>

            </section>

            {/* =========================================
                FOOTER
            ========================================= */}

            <footer className="bg-[#111] text-white">

                <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-14">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                        {/* BRAND */}

                        <div>

                            <h2 className="text-3xl font-bold tracking-[0.3em]">
                                SNITCH
                            </h2>

                            <p className="mt-5 text-sm text-gray-400 leading-6 max-w-xs">
                                Redefining everyday style.
                                Premium fashion for those who
                                move different.
                            </p>

                        </div>

                        {/* SHOP */}

                        <div>

                            <h3 className="font-medium mb-5">
                                Shop
                            </h3>

                            <div className="space-y-3 text-sm text-gray-400">

                                <p>Men</p>
                                <p>Women</p>
                                <p>New Arrivals</p>
                                <p>Collections</p>
                                <p>Sale</p>

                            </div>

                        </div>

                        {/* HELP */}

                        <div>

                            <h3 className="font-medium mb-5">
                                Help
                            </h3>

                            <div className="space-y-3 text-sm text-gray-400">

                                <p>FAQ</p>
                                <p>Shipping</p>
                                <p>Returns & Exchange</p>
                                <p>Size Guide</p>
                                <p>Track Order</p>

                            </div>

                        </div>

                        {/* COMPANY */}

                        <div>

                            <h3 className="font-medium mb-5">
                                Company
                            </h3>

                            <div className="space-y-3 text-sm text-gray-400">

                                <p>About Us</p>
                                <p>Contact Us</p>
                                <p>Terms of Service</p>
                                <p>Privacy Policy</p>

                            </div>

                        </div>

                    </div>

                    <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col sm:flex-row justify-between gap-4 text-xs text-gray-500">

                        <p>
                            © 2026 SNITCH. All Rights Reserved.
                        </p>

                        <p>
                            India (INR ₹) · English
                        </p>

                    </div>

                </div>

            </footer>

        </div>
    );
};

export default ProductDetails;