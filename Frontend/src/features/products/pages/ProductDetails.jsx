import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";
import { useCart } from "../../cart/hooks/UseCart";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        handleGetProductById,
        handleGetAllProducts,
    } = useProduct();

    const {
        handleAddItem,
        handleGetCart,
    } = useCart()

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [activeImage, setActiveImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    // VARIANT STATES
    const [selectedColor, setSelectedColor] = useState(null);
    const [activeAccordion, setActiveAccordion] = useState(null);

    const defaultSizes = ["S", "M", "L", "XL"];

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

    const increaseQuantity = (maxStock = Infinity) => {
        setQuantity((prev) => (prev < maxStock ? prev + 1 : prev));
    };

    const decreaseQuantity = () => {
        setQuantity((prev) => Math.max(1, prev - 1));
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

    // =========================================
    // VARIANT HELPER LOGIC
    // =========================================
    const variants = product.variants || [];

    // Extract unique colors and pick their first available thumbnail image
    const variantColors = Array.from(
        new Set(
            variants
                .map((v) =>
                    v.attributes instanceof Map
                        ? v.attributes.get("color") || v.attributes.get("Color")
                        : v.attributes?.color || v.attributes?.Color
                )
                .filter(Boolean)
        )
    ).map((color) => {
        const matchingVariant = variants.find((v) => {
            const vColor =
                v.attributes instanceof Map
                    ? v.attributes.get("color") || v.attributes.get("Color")
                    : v.attributes?.color || v.attributes?.Color;
            return vColor === color;
        });

        const image = matchingVariant?.images?.[0];
        return {
            color,
            imageUrl: getImageUrl(image),
        };
    });

    // Helper to extract size keys from a variant's sizes map/object
    const getVariantSizesList = (variant) => {
        if (!variant) return [];

        // New variant structure:
        // attributes: { color: "Black", size: "M" }
        const attributeSize =
            variant.attributes instanceof Map
                ? variant.attributes.get("size") || variant.attributes.get("Size")
                : variant.attributes?.size || variant.attributes?.Size;

        if (attributeSize) {
            return [attributeSize];
        }

        // Backward compatibility for variants using sizes map
        if (variant.sizes) {
            if (variant.sizes instanceof Map) {
                return Array.from(variant.sizes.keys());
            }

            return Object.keys(variant.sizes);
        }

        return [];
    };

    // Calculate available sizes depending on whether a color variant is selected
    let displaySizes = defaultSizes;
    if (selectedColor && variants.length > 0) {
        const colorVariants = variants.filter((v) => {
            const vColor =
                v.attributes instanceof Map
                    ? v.attributes.get("color") || v.attributes.get("Color")
                    : v.attributes?.color || v.attributes?.Color;
            return vColor === selectedColor;
        });

        const sizesSet = new Set();
        colorVariants.forEach((v) => {
            getVariantSizesList(v).forEach((sz) => sizesSet.add(sz));
        });

        if (sizesSet.size > 0) {
            displaySizes = Array.from(sizesSet);
        }
    }

    // Resolve concrete variant when both Color and Size are chosen
    let concreteVariant = null;
    if (selectedColor && selectedSize && variants.length > 0) {
        concreteVariant = variants.find((v) => {
            const vColor =
                v.attributes instanceof Map
                    ? v.attributes.get("color") || v.attributes.get("Color")
                    : v.attributes?.color || v.attributes?.Color;

            const sizesList = getVariantSizesList(v);

            return vColor === selectedColor && sizesList.includes(selectedSize);
        });
    }

    // Extract stock for concrete variant
    let concreteStock = null;

    if (concreteVariant) {
        concreteStock = concreteVariant.stock ?? 0;
    }

    const concreteVariantImage = getImageUrl(concreteVariant?.images?.[0]);

    // Handle variant color click
    const handleColorSelect = (color) => {
        setSelectedColor(color);
        setSelectedSize(null);
        setQuantity(1);
    };

    // Action handlers using concrete variant or base product
    // const handleAddToCart = () => {
    //     if (!selectedSize) {
    //         alert("Please select a size");
    //         return;
    //     }

    //     console.log("ADD TO CART", {
    //         productId: product._id,
    //         variantId: concreteVariant?._id || null,
    //         color: selectedColor,
    //         size: selectedSize,
    //         quantity,
    //         stock: concreteStock,
    //     });
    // };

    const handleAddToCart = async () => {
        if (!selectedSize) {
            alert("Please select a size");
            return;
        }

        if (concreteVariant && (!concreteStock || concreteStock <= 0)) {
            alert("This variant is out of stock");
            return;
        }

        try {
            const data = await handleAddItem({
                productId: product._id,
                variantId: concreteVariant?._id || null,
                size: selectedSize,
                quantity,
            });

            console.log("ADD TO CART SUCCESS:", data);
        } catch (error) {
            console.error(
                "ADD TO CART ERROR:",
                error.response?.data
            );
        }
    };

    const testGetCart = async () => {
        try {
            const cart = await handleGetCart();

            console.log("CART FROM DATABASE:", cart);
            console.log("CART ITEMS:", cart.items);
        } catch (error) {
            console.error(
                "GET CART ERROR:",
                error.response?.data || error
            );
        }
    };

    const testUpdate = async () => {
        try {
            const cart = await handleUpdateCartItem({
                itemId: "YOUR_CART_ITEM_ID",
                quantity: 2
            });

            console.log("UPDATED CART:", cart);
        } catch (error) {
            console.error(
                "UPDATE CART ERROR:",
                error.response?.data || error
            );
        }
    };

    const testRemove = async () => {
        try {
            const firstItem = cart?.items?.[0];

            if (!firstItem) {
                console.log("No cart items found");
                return;
            }

            console.log("REMOVING ITEM:", firstItem._id);

            const updatedCart = await handleRemoveCartItem(
                firstItem._id
            );

            console.log("CART AFTER REMOVE:", updatedCart);

            setCart(updatedCart);
        } catch (error) {
            console.error(
                "REMOVE CART ERROR:",
                error.response?.data || error
            );
        }
    };

    const handleBuyNow = () => {
        if (!selectedSize) {
            alert("Please select a size");
            return;
        }

        console.log("BUY NOW", {
            productId: product._id,
            variantId: concreteVariant?._id || null,
            color: selectedColor,
            size: selectedSize,
            quantity,
            stock: concreteStock,
        });
    };

    return (
        <div className="min-h-screen bg-white text-black">

            {/* =========================================
                PRODUCT SECTION
            ========================================= */}

            <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10">

                <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16">

                    {/* =================================
                        LEFT - IMAGE GALLERY (UNCHANGED)
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
                                            ${activeImage === index
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

                        {/* =========================================
                            VARIANT SELECTOR
                        ========================================= */}

                        {variantColors.length > 0 && (
                            <div className="mt-8">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-sm font-semibold">
                                        Select Variant
                                    </h2>
                                    {selectedColor && (
                                        <span className="text-xs font-medium text-gray-600">
                                            Color: <strong className="text-black">{selectedColor}</strong>
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {variantColors.map(({ color, imageUrl }) => {
                                        const isSelected = selectedColor === color;

                                        return (
                                            <button
                                                key={color}
                                                onClick={() => handleColorSelect(color)}
                                                className={`
                                                    flex flex-col items-center gap-1.5 p-1.5 rounded-xl border transition-all duration-200
                                                    ${isSelected
                                                        ? "border-black bg-gray-50 ring-1 ring-black"
                                                        : "border-gray-200 hover:border-gray-400 bg-white"
                                                    }
                                                `}
                                            >
                                                <div className="w-12 h-14 rounded-lg overflow-hidden bg-[#f5f5f5] flex items-center justify-center border border-gray-100">
                                                    {imageUrl ? (
                                                        <img
                                                            src={imageUrl}
                                                            alt={color}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-[10px] font-semibold uppercase text-gray-500">
                                                            {color.slice(0, 3)}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs font-medium px-1">
                                                    {color}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

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

                                {displaySizes.map((size) => (

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

                                            ${selectedSize === size
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

                        {/* CONCRETE VARIANT PREVIEW & STOCK INFORMATION */}

                        {concreteVariant && (
                            <div className="mt-6 p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex items-center gap-4">
                                {concreteVariantImage ? (
                                    <img
                                        src={concreteVariantImage}
                                        alt={`${selectedColor} ${selectedSize}`}
                                        className="w-16 h-20 object-cover rounded-lg border border-gray-200"
                                    />
                                ) : (
                                    <div className="w-16 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">
                                        No Image
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-gray-500">
                                        Selected Variant
                                    </p>
                                    <p className="text-sm font-semibold text-black mt-0.5">
                                        {selectedColor} / {selectedSize}
                                    </p>
                                    {concreteStock !== null && (
                                        <p className={`text-xs mt-1 font-medium ${concreteStock > 0 ? "text-emerald-600" : "text-red-500"}`}>
                                            {concreteStock > 0 ? `In Stock (${concreteStock} available)` : "Out of Stock"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

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
                                    onClick={() => increaseQuantity(concreteStock ?? Infinity)}
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
                                disabled={concreteStock === 0}
                                className={`
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
                                    ${concreteStock === 0 ? "opacity-50 cursor-not-allowed hover:bg-white hover:text-black" : ""}
                                `}

                            >
                                Add To Cart
                            </button>

                           

                            <button
                                onClick={handleBuyNow}
                                disabled={concreteStock === 0}
                                className={`
                                    h-14
                                    rounded-full
                                    bg-black
                                    text-white
                                    font-medium
                                    hover:bg-[#222]
                                    transition-all
                                    ${concreteStock === 0 ? "opacity-50 cursor-not-allowed hover:bg-black" : ""}
                                `}
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
                            ].map((item, idx) => (

                                <div key={item} className="border-b border-gray-200">
                                    <button
                                        onClick={() =>
                                            setActiveAccordion(
                                                activeAccordion === idx ? null : idx
                                            )
                                        }
                                        className="
                                            w-full
                                            flex
                                            justify-between
                                            items-center
                                            py-5
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
                                            {activeAccordion === idx ? "−" : "+"}
                                        </span>

                                    </button>

                                    {activeAccordion === idx && (
                                        <div className="pb-5 text-sm text-gray-600 leading-relaxed">
                                            {item === "Product Details" && (product.description || "Premium fashion engineered for everyday durability.")}
                                            {item === "Shipping & Returns" && "Standard shipping takes 3-5 business days. 7-day hassle-free exchange policy."}
                                            {item === "Care Instructions" && "Machine wash cold with like colors. Do not bleach. Tumble dry low."}
                                        </div>
                                    )}
                                </div>

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
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Add quick add logic here if needed
                                        }}
                                        aria-label="Add to cart"
                                        className="
        absolute
        bottom-4
        right-4
        w-10
        h-10
        rounded-full
        bg-white
        text-black
        flex
        items-center
        justify-center      
        shadow-md
        hover:bg-black
        hover:text-white
        transition-all
        duration-200
        group/btn
    "
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.8"
                                            stroke="currentColor"
                                            className="w-5 h-5 transition-transform duration-200 group-hover/btn:scale-110"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                            />
                                        </svg>
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