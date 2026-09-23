import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";

const QUICK_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

// Helper to extract attribute values whether Map or Object, case-insensitively
const getAttributeValue = (attributes, key) => {
    if (!attributes) return "";
    if (attributes instanceof Map) {
        return (
            attributes.get(key) ||
            attributes.get(key.toLowerCase()) ||
            attributes.get(key.toUpperCase()) ||
            ""
        );
    }
    if (typeof attributes === "object") {
        return (
            attributes[key] ||
            attributes[key.toLowerCase()] ||
            attributes[key.toUpperCase()] ||
            ""
        );
    }
    return "";
};

const formatVariantTitle = (variant, index) => {
    const size = getAttributeValue(variant.attributes, "size");
    const color = getAttributeValue(variant.attributes, "color");

    if (color && size) {
        return `${color} / ${size}`;
    }
    if (color) {
        return color;
    }
    if (size) {
        return `Size: ${size}`;
    }
    return `Variant ${index + 1}`;
};

const SellerProductEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { handleGetProductById, handleUpdateProduct, handleUploadProductImage } = useProduct();

    const [product, setProduct] = useState(null);
    const [variants, setVariants] = useState([]);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Variant Editor State
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [formSizes, setFormSizes] = useState([]);
    const [sizeStocks, setSizeStocks] = useState({});
    const [formColor, setFormColor] = useState("");
    const [formImages, setFormImages] = useState([]);
    const [urlInput, setUrlInput] = useState("");
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [formError, setFormError] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef(null);
    const editorRef = useRef(null);

    async function fetchProductDetails() {
        try {
            console.log("Fetching product:", id);
            const data = await handleGetProductById(id);
            console.log("Fetched Product:", data);
            setProduct(data);
            setVariants(data.variants || []);
        } catch (error) {
            console.error("Failed to fetch Product Details!", error);
        }
    }

    useEffect(() => {
        if (id) {
            fetchProductDetails();
        }
    }, [id]);

    const handleOpenAddVariant = () => {
        setEditingIndex(null);
        setFormSizes([]);
        setSizeStocks({});
        setFormColor("");
        setFormImages([]);
        setUrlInput("");
        setShowUrlInput(false);
        setFormError("");
        setIsEditorOpen(true);

        setTimeout(() => {
            editorRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }, 50);
    };

    const handleOpenEditVariant = (index) => {
        const v = variants[index];

        const size = getAttributeValue(v.attributes, "size");

        setEditingIndex(index);
        setFormSizes(size ? [size] : []);
        setSizeStocks(
            size
                ? {
                    [size]: v.stock !== undefined && v.stock !== null
                        ? String(v.stock)
                        : "0",
                }
                : {}
        );
        setFormColor(getAttributeValue(v.attributes, "color"));
        setFormImages(v.images ? [...v.images] : []);
        setUrlInput("");
        setShowUrlInput(false);
        setFormError("");
        setIsEditorOpen(true);

        setTimeout(() => {
            editorRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }, 50);
    };

    const handleCancelVariant = () => {
        setIsEditorOpen(false);
        setEditingIndex(null);
        setFormError("");
        setUrlInput("");
        setShowUrlInput(false);
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setIsUploading(true);
        setFormError("");

        try {
            for (const file of files) {
                const res = await handleUploadProductImage(file);
                const imgUrl = res?.imageUrl || res?.image?.url || res?.images?.[0]?.url;
                if (imgUrl) {
                    setFormImages((prev) => [...prev, { url: imgUrl }]);
                }
            }
        } catch (err) {
            console.error("Variant image upload failed:", err);
            setFormError("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleAddImageUrl = () => {
        if (!urlInput.trim()) return;
        setFormImages((prev) => [...prev, { url: urlInput.trim() }]);
        setUrlInput("");
        setShowUrlInput(false);
    };

    const handleRemoveImage = (imgIdxToRemove) => {
        setFormImages((prev) => prev.filter((_, idx) => idx !== imgIdxToRemove));
    };


    const handleToggleSize = (size) => {
        setFormSizes((prev) => {
            if (prev.includes(size)) {
                const next = prev.filter((item) => item !== size);

                setSizeStocks((stocks) => {
                    const updated = { ...stocks };
                    delete updated[size];
                    return updated;
                });

                return next;
            }

            setSizeStocks((stocks) => ({
                ...stocks,
                [size]: stocks[size] ?? "",
            }));

            return [...prev, size];
        });
    };

    const handleSizeStockChange = (size, value) => {
        setSizeStocks((prev) => ({
            ...prev,
            [size]: value,
        }));
    };

    const handleSubmitVariant = (e) => {
        e?.preventDefault();
        setFormError("");

        const trimmedColor = formColor.trim();

        if (formSizes.length === 0) {
            setFormError("Select at least one size.");
            return;
        }

        if (!trimmedColor) {
            setFormError("Color is required.");
            return;
        }

        // Validate stock for every selected size
        for (const size of formSizes) {
            const stockValue = sizeStocks[size];

            if (
                stockValue === "" ||
                stockValue === undefined ||
                stockValue === null ||
                isNaN(Number(stockValue)) ||
                Number(stockValue) < 0
            ) {
                setFormError(`Enter a valid stock quantity for size ${size}.`);
                return;
            }
        }

        // ---------------------------------------------------------
        // EDIT EXISTING VARIANT
        // ---------------------------------------------------------
        if (editingIndex !== null) {
            const existingVariant = variants[editingIndex];

            const selectedSize = formSizes[0];

            const isDuplicate = variants.some((v, idx) => {
                if (idx === editingIndex) return false;

                const vSize = getAttributeValue(
                    v.attributes,
                    "size"
                )
                    .trim()
                    .toLowerCase();

                const vColor = getAttributeValue(
                    v.attributes,
                    "color"
                )
                    .trim()
                    .toLowerCase();

                return (
                    vSize === selectedSize.trim().toLowerCase() &&
                    vColor === trimmedColor.toLowerCase()
                );
            });

            if (isDuplicate) {
                setFormError(
                    `A variant with "${trimmedColor} / ${selectedSize}" already exists.`
                );
                return;
            }

            let existingAttributes = {};

            if (existingVariant.attributes instanceof Map) {
                existingAttributes = Object.fromEntries(
                    existingVariant.attributes
                );
            } else if (
                existingVariant.attributes &&
                typeof existingVariant.attributes === "object"
            ) {
                existingAttributes = {
                    ...existingVariant.attributes,
                };
            }

            const updatedVariant = {
                ...existingVariant,
                stock: Number(sizeStocks[selectedSize]) || 0,
                attributes: {
                    ...existingAttributes,
                    size: selectedSize.trim(),
                    color: trimmedColor,
                },
                images: formImages.map((img) => ({
                    url: typeof img === "string" ? img : img.url,
                })),
            };

            setVariants((prev) =>
                prev.map((v, idx) =>
                    idx === editingIndex ? updatedVariant : v
                )
            );
        }

        // ---------------------------------------------------------
        // ADD NEW VARIANTS
        // ---------------------------------------------------------
        else {
            const newVariants = [];

            for (const size of formSizes) {
                const trimmedSize = size.trim();

                const isDuplicate = variants.some((v) => {
                    const vSize = getAttributeValue(
                        v.attributes,
                        "size"
                    )
                        .trim()
                        .toLowerCase();

                    const vColor = getAttributeValue(
                        v.attributes,
                        "color"
                    )
                        .trim()
                        .toLowerCase();

                    return (
                        vSize === trimmedSize.toLowerCase() &&
                        vColor === trimmedColor.toLowerCase()
                    );
                });

                if (isDuplicate) {
                    setFormError(
                        `A variant with "${trimmedColor} / ${trimmedSize}" already exists.`
                    );
                    return;
                }

                newVariants.push({
                    stock: Number(sizeStocks[size]) || 0,
                    attributes: {
                        size: trimmedSize,
                        color: trimmedColor,
                    },
                    images: formImages.map((img) => ({
                        url: typeof img === "string" ? img : img.url,
                    })),
                });
            }

            setVariants((prev) => [...prev, ...newVariants]);
        }

        setIsEditorOpen(false);
        setEditingIndex(null);
        setFormSizes([]);
        setSizeStocks({});
        setFormError("");
    };

    const handleDeleteVariant = (indexToDelete) => {
        setVariants((prev) => prev.filter((_, idx) => idx !== indexToDelete));
        if (editingIndex === indexToDelete) {
            setIsEditorOpen(false);
            setEditingIndex(null);
        } else if (editingIndex !== null && editingIndex > indexToDelete) {
            setEditingIndex(editingIndex - 1);
        }
    };

    const handleSaveChanges = async () => {
        try {
            setSaving(true);

            // Sanitize variants for backend Map attributes and numeric stock
            const preparedVariants = variants.map((v) => {
                let attrObj = {};
                if (v.attributes instanceof Map) {
                    attrObj = Object.fromEntries(v.attributes);
                } else if (v.attributes && typeof v.attributes === "object") {
                    attrObj = { ...v.attributes };
                }

                return {
                    ...v,
                    stock: Number(v.stock) || 0,
                    attributes: attrObj,
                    images: (v.images || []).map((img) => ({
                        url: typeof img === "string" ? img : img.url,
                    })),
                };
            });

            const payload = {
                ...product,
                variants: preparedVariants,
            };

            await handleUpdateProduct(id, payload);

            setSaved(true);

            setTimeout(() => {
                navigate("/seller/dashboard");
            }, 800);
        } catch (error) {
            console.error("Failed to save changes!", error);
        } finally {
            setSaving(false);
        }
    };

    // Loading state
    if (!product) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f7f7f5] text-[11px] uppercase tracking-[0.18em] text-black/40">
                Loading product...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f7f5] text-[#111111]">
            {/* Header */}
            <header className="flex h-[52px] items-center justify-between border-b border-black/[0.08] px-6 sm:px-10">
                <div className="flex items-center gap-3">
                    <span className="text-[15px] font-semibold tracking-[0.18em]">
                        SNITCH
                    </span>
                    <span className="h-1 w-1 rounded-full bg-black/20" />
                    <span className="text-[10px] tracking-wide text-black/40">
                        Seller Studio
                    </span>
                </div>

                <span className="text-[10px] uppercase tracking-[0.16em] text-black/35">
                    Edit Product
                </span>
            </header>

            {/* Main */}
            <main className="mx-auto max-w-5xl px-6 py-14 sm:px-10">
                {/* Heading */}
                <div className="mb-14">
                    <p className="mb-4 text-[10px] font-medium tracking-[0.22em] text-black/40">
                        PRODUCT EDITOR
                    </p>

                    <h1 className="text-[42px] font-medium leading-none tracking-[-0.05em] sm:text-[58px]">
                        Edit product.
                    </h1>

                    <p className="mt-5 max-w-lg text-[13px] leading-6 text-black/40">
                        Update your product information, images, inventory and variants.
                    </p>
                </div>

                {/* Section 01: Product Information */}
                <section className="border-t border-black/[0.08] py-10">
                    <div className="mb-8">
                        <p className="text-[10px] font-medium tracking-[0.2em] text-black/35">
                            01
                        </p>
                        <h2 className="mt-2 text-[20px] font-medium tracking-[-0.02em]">
                            Product information
                        </h2>
                    </div>

                    <div className="max-w-2xl space-y-8">
                        {/* Title */}
                        <div>
                            <label className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-black/40">
                                Product title
                            </label>
                            <input
                                type="text"
                                value={product.title || ""}
                                onChange={(e) => {
                                    setProduct((prev) => ({
                                        ...prev,
                                        title: e.target.value,
                                    }));
                                }}
                                className="w-full border-b border-black/15 bg-transparent py-3 text-[15px] outline-none transition-colors focus:border-black"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-black/40">
                                Description
                            </label>
                            <textarea
                                value={product.description || ""}
                                onChange={(e) => {
                                    setProduct((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }));
                                }}
                                rows={5}
                                className="w-full resize-none border-b border-black/15 bg-transparent py-3 text-[14px] leading-6 outline-none transition-colors focus:border-black"
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-black/40">
                                Price ({product?.price?.currency || "INR"})
                            </label>
                            <input
                                type="number"
                                value={product?.price?.amount ?? ""}
                                onChange={(e) => {
                                    setProduct((prev) => ({
                                        ...prev,
                                        price: {
                                            ...prev.price,
                                            amount: Number(e.target.value),
                                        },
                                    }));
                                }}
                                className="w-full border-b border-black/15 bg-transparent py-3 text-[15px] outline-none transition-colors focus:border-black"
                            />
                        </div>
                    </div>
                </section>

                {/* Section 02: Variants */}
                <section className="border-t border-black/[0.08] py-10">
                    <div className="mb-8 flex items-end justify-between">
                        <div>
                            <p className="text-[10px] font-medium tracking-[0.2em] text-black/35">
                                02
                            </p>
                            <h2 className="mt-2 text-[20px] font-medium tracking-[-0.02em]">
                                Variants
                            </h2>
                        </div>

                        {!isEditorOpen && (
                            <button
                                type="button"
                                onClick={handleOpenAddVariant}
                                className="text-[11px] font-medium uppercase tracking-[0.14em] text-black/60 transition-colors hover:text-black"
                            >
                                + Add variant
                            </button>
                        )}
                    </div>

                    {/* Inline Add / Edit Variant Panel */}
                    {isEditorOpen && (
                        <div
                            ref={editorRef}
                            className="mb-8 border border-black/[0.12] bg-white p-6 sm:p-8"
                        >
                            <div className="mb-6 flex items-center justify-between border-b border-black/[0.06] pb-4">
                                <div>
                                    <h3 className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#111111]">
                                        {editingIndex !== null ? "Edit variant" : "Add variant"}
                                    </h3>
                                    <p className="mt-1 text-[11px] text-black/40">
                                        {editingIndex !== null
                                            ? "Modify size, color, stock or images for this variant."
                                            : "Configure attributes, stock and images for the new variant."}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleCancelVariant}
                                    className="text-[10px] uppercase tracking-[0.14em] text-black/40 hover:text-black"
                                >
                                    Cancel
                                </button>
                            </div>

                            {formError && (
                                <div className="mb-6 border border-red-200 bg-red-50/60 px-4 py-2.5 text-[12px] text-red-600">
                                    {formError}
                                </div>
                            )}

                            <div className="space-y-6">
                                {/* Size & Color Grid */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    {/* Size */}
                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <label className="text-[10px] uppercase tracking-[0.16em] text-black/40">
                                                Size *
                                            </label>

                                            <span className="text-[9px] uppercase tracking-wider text-black/30">
                                                Select one or more
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5">
                                            {QUICK_SIZES.map((sz) => {
                                                const selected = formSizes.includes(sz);

                                                return (
                                                    <button
                                                        key={sz}
                                                        type="button"
                                                        onClick={() => handleToggleSize(sz)}
                                                        className={`border px-3 py-1.5 text-[10px] font-medium tracking-wider transition-colors ${selected
                                                                ? "border-black bg-black text-white"
                                                                : "border-black/10 bg-[#f7f7f5] text-black/60 hover:border-black/30 hover:text-black"
                                                            }`}
                                                    >
                                                        {sz}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <input
                                            type="text"
                                            placeholder="Custom size..."
                                            onKeyDown={(e) => {
                                                if (e.key !== "Enter") return;

                                                e.preventDefault();

                                                const customSize = e.target.value.trim();

                                                if (!customSize) return;

                                                if (!formSizes.includes(customSize)) {
                                                    setFormSizes((prev) => [...prev, customSize]);

                                                    setSizeStocks((prev) => ({
                                                        ...prev,
                                                        [customSize]: "",
                                                    }));
                                                }

                                                e.target.value = "";
                                            }}
                                            className="mt-3 w-full border-b border-black/15 bg-transparent py-2.5 text-[14px] outline-none transition-colors focus:border-black"
                                        />

                                        {formSizes.length > 0 && (
                                            <div className="mt-5 space-y-3">
                                                <p className="text-[9px] uppercase tracking-[0.16em] text-black/35">
                                                    Stock by size
                                                </p>

                                                {formSizes.map((size) => (
                                                    <div
                                                        key={size}
                                                        className="flex items-center justify-between border-b border-black/[0.06] pb-2"
                                                    >
                                                        <span className="text-[12px] font-medium">
                                                            {size}
                                                        </span>

                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={sizeStocks[size] ?? ""}
                                                            onChange={(e) =>
                                                                handleSizeStockChange(
                                                                    size,
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="0"
                                                            className="w-24 border-b border-black/15 bg-transparent py-1.5 text-right text-[13px] outline-none focus:border-black"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Color */}
                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <label className="text-[10px] uppercase tracking-[0.16em] text-black/40">
                                                Color *
                                            </label>
                                            <span className="text-[9px] uppercase tracking-wider text-black/30">
                                                e.g. Black, Off-White
                                            </span>
                                        </div>

                                        <input
                                            type="text"
                                            value={formColor}
                                            onChange={(e) => setFormColor(e.target.value)}
                                            placeholder="Enter color..."
                                            className="w-full border-b border-black/15 bg-transparent py-2.5 text-[14px] outline-none transition-colors focus:border-black"
                                        />
                                    </div>
                                </div>

                                {/* Stock
                                <div className="max-w-xs">
                                    <label className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-black/40">
                                        Stock Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formStock}
                                        onChange={(e) => setFormStock(e.target.value)}
                                        placeholder="0"
                                        className="w-full border-b border-black/15 bg-transparent py-2.5 text-[14px] outline-none transition-colors focus:border-black"
                                    />
                                </div> */}

                                {/* Variant Images */}
                                <div>
                                    <div className="mb-3 flex items-center justify-between">
                                        <label className="text-[10px] uppercase tracking-[0.16em] text-black/40">
                                            Variant Images
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setShowUrlInput((prev) => !prev)}
                                            className="text-[10px] tracking-wide text-black/45 underline hover:text-black"
                                        >
                                            {showUrlInput ? "Hide URL input" : "+ Add image via URL"}
                                        </button>
                                    </div>

                                    {/* Direct URL input fallback */}
                                    {showUrlInput && (
                                        <div className="mb-4 flex items-center gap-2">
                                            <input
                                                type="url"
                                                value={urlInput}
                                                onChange={(e) => setUrlInput(e.target.value)}
                                                placeholder="https://..."
                                                className="flex-1 border-b border-black/15 bg-transparent py-1.5 text-[13px] outline-none focus:border-black"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddImageUrl}
                                                className="border border-black/15 px-3 py-1 text-[10px] uppercase tracking-wider text-black/60 hover:border-black hover:text-black"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    )}

                                    {/* Image Thumbnails & Upload Button */}
                                    <div className="flex flex-wrap items-center gap-3">
                                        {formImages.map((img, idx) => {
                                            const url = typeof img === "string" ? img : img.url;
                                            return (
                                                <div
                                                    key={idx}
                                                    className="group relative h-16 w-16 border border-black/10 bg-[#f7f7f5]"
                                                >
                                                    <img
                                                        src={url}
                                                        alt={`Variant thumbnail ${idx + 1}`}
                                                        className="h-full w-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(idx)}
                                                        title="Remove image"
                                                        className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] text-white opacity-90 transition-opacity hover:opacity-100"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            );
                                        })}

                                        {/* Upload button */}
                                        <label className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center border border-dashed border-black/20 bg-[#fafafa] transition-colors hover:border-black/40 hover:bg-[#f0f0ee]">
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/png, image/jpeg, image/webp"
                                                multiple
                                                onChange={handleImageUpload}
                                                disabled={isUploading}
                                                className="hidden"
                                            />
                                            {isUploading ? (
                                                <span className="text-[9px] uppercase tracking-wider text-black/40">
                                                    ...
                                                </span>
                                            ) : (
                                                <>
                                                    <span className="text-sm font-light text-black/50">
                                                        +
                                                    </span>
                                                    <span className="text-[8px] uppercase tracking-wider text-black/40">
                                                        Upload
                                                    </span>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                    {isUploading && (
                                        <p className="mt-2 text-[10px] tracking-wide text-black/40">
                                            Uploading image to storage...
                                        </p>
                                    )}
                                </div>

                                {/* Form Actions */}
                                <div className="flex items-center justify-end gap-3 border-t border-black/[0.06] pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCancelVariant}
                                        className="px-5 py-2.5 text-[10px] uppercase tracking-[0.16em] text-black/50 transition-colors hover:text-black"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmitVariant}
                                        className="bg-[#111111] px-6 py-2.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-85"
                                    >
                                        {editingIndex !== null ? "Update variant" : "Add variant"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Existing Variants List */}
                    {variants.length === 0 ? (
                        <div className="border border-dashed border-black/15 bg-white/40 p-8 text-center">
                            <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-black/40">
                                No variants configured
                            </p>
                            <p className="mt-1 text-[11px] text-black/35">
                                Add sizes, colors, and stock levels to give customers buying options.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {variants.map((variant, index) => {
                                const title = formatVariantTitle(variant, index);
                                const variantImages = variant.images || [];

                                return (
                                    <div
                                        key={variant._id || index}
                                        className="flex flex-col justify-between gap-4 border border-black/[0.08] bg-white p-5 transition-colors sm:flex-row sm:items-center"
                                    >
                                        <div>
                                            <p className="text-[14px] font-medium tracking-tight text-[#111111]">
                                                {title}
                                            </p>

                                            <p className="mt-1 text-[11px] text-black/45">
                                                Stock · {variant.stock ?? 0}
                                            </p>

                                            {/* Thumbnail previews */}
                                            {variantImages.length > 0 && (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {variantImages.map((img, imgIdx) => {
                                                        const url =
                                                            typeof img === "string" ? img : img?.url;
                                                        if (!url) return null;
                                                        return (
                                                            <img
                                                                key={imgIdx}
                                                                src={url}
                                                                alt={`${title} thumbnail ${imgIdx + 1}`}
                                                                className="h-10 w-10 border border-black/10 object-cover"
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-5 sm:self-center">
                                            <button
                                                type="button"
                                                onClick={() => handleOpenEditVariant(index)}
                                                className="text-[10px] uppercase tracking-[0.14em] text-black/50 transition-colors hover:text-black"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDeleteVariant(index)}
                                                className="text-[10px] uppercase tracking-[0.14em] text-black/40 transition-colors hover:text-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* Section 03: Save Changes */}
                <section className="border-t border-black/[0.08] py-10">
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleSaveChanges}
                            disabled={saving || saved}
                            className="bg-[#111111] px-8 py-4 text-[10px] font-medium uppercase tracking-[0.18em] text-white transition-all duration-300 hover:opacity-80 disabled:cursor-default disabled:opacity-80"
                        >
                            {saved
                                ? "Changes saved"
                                : saving
                                    ? "Saving..."
                                    : "Save changes"}
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default SellerProductEdit;