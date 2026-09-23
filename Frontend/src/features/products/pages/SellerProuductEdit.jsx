import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";

const SellerProductEdit = () => {
    const navigate = useNavigate();

    const { id } = useParams();
    const { handleGetProductById, handleUpdateProduct } = useProduct();

    const [product, setProduct] = useState(null);


    const [saving, setSaving] = useState(false);


    const [saved, setSaved] = useState(false);



    async function fetchProductDetails() {
        try {
            console.log("Fetching product:", id);

            const data = await handleGetProductById(id);

            console.log("Fetched Product:", data);

            setProduct(data);
        } catch (error) {
            console.log("Failed to fetch Product Details!", error);
        }
    }

    useEffect(() => {
        if (id) {
            fetchProductDetails();
        }
    }, [id]);


    // Loading state
    if (!product) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f7f7f5] text-[11px] uppercase tracking-[0.18em] text-black/40">
                Loading product...
            </div>
        );
    }

    const handleSaveChanges = async () => {
        try {
            setSaving(true);

            await handleUpdateProduct(id, product);

            setSaved(true);

            setTimeout(() => {
                navigate("/seller/dashboard");
            }, 800);

        } catch (error) {
            console.log("Failed to save changes!", error);
        } finally {
            setSaving(false);
        }
    };


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


                {/* Product Information */}
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
                                Price
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


                {/* Variants */}
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

                        <button
                            type="button"
                            className="text-[11px] font-medium uppercase tracking-[0.14em] text-black/50 transition-colors hover:text-black"
                        >
                            + Add variant
                        </button>

                    </div>


                    {/* Existing variants */}
                    <div className="space-y-3">

                        {product.variants?.map((variant, index) => (

                            <div
                                key={variant._id || index}
                                className="flex items-center justify-between border border-black/[0.08] bg-white px-5 py-5"
                            >

                                <div>

                                    <p className="text-[14px] font-medium">
                                        Variant {index + 1}
                                    </p>

                                    <p className="mt-1 text-[11px] text-black/40">
                                        Stock: {variant.stock}
                                    </p>

                                </div>


                                <div className="flex items-center gap-5">

                                    <button
                                        type="button"
                                        className="text-[10px] uppercase tracking-[0.14em] text-black/40 transition-colors hover:text-black"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        className="text-[10px] uppercase tracking-[0.14em] text-black/40 transition-colors hover:text-red-600"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                </section>


                {/* Save */}
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
                                    : "Save changes"
                            }
                        </button>

                    </div>

                </section>

            </main>

        </div>
    );
};

export default SellerProductEdit;