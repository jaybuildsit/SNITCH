import React, { useEffect, useState } from "react";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const Dashboard = () => {
    const navigate = useNavigate();

    const {
        handleGetSellerProduct,
        handleDeleteProduct,
    } = useProduct();

    const sellerProducts = useSelector(
        (state) => state.product.sellerProducts
    );

    const [search, setSearch] = useState("");
    const [openMenu, setOpenMenu] = useState(null);
    const [deleteProductId, setDeleteProductId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        handleGetSellerProduct();
    }, []);

    const products = Array.isArray(sellerProducts)
        ? sellerProducts
        : [];

    const filteredProducts = products.filter((product) =>
        product?.title
            ?.toLowerCase()
            .includes(search.toLowerCase())
    );

    const handleDelete = async () => {
        if (!deleteProductId) return;

        try {
            setIsDeleting(true);

            await handleDeleteProduct(deleteProductId);

            setDeleteProductId(null);
        } catch (error) {
            console.error("Delete product error:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">

            {/* Navigation */}
            <header className="sticky top-0 z-20 border-b border-neutral-100 bg-white/95 backdrop-blur-sm">
                <div className="mx-auto flex h-[52px] max-w-5xl items-center justify-between px-5 sm:px-8">

                    <div className="flex items-center gap-2.5">
                        <span className="text-[13px] font-bold uppercase tracking-[0.18em] text-neutral-950">
                            SNITCH
                        </span>

                        <span className="text-xs text-neutral-300">
                            ·
                        </span>

                        <span className="text-[11px] tracking-wide text-neutral-400">
                            Seller Studio
                        </span>
                    </div>

                    <button
                        type="button"
                        className="text-[11px] font-medium text-neutral-600 transition-colors hover:text-neutral-950"
                        onClick={() => navigate("/seller/create")}
                    >
                        + Add product
                    </button>

                </div>
            </header>

            {/* Main */}
            <main className="mx-auto max-w-5xl px-5 pb-20 pt-9 sm:px-8">

                {/* Header */}
                <div className="mb-8">

                    <nav className="mb-3">
                        <ol className="flex items-center gap-1.5 text-[11px] tracking-wide text-neutral-400">
                            <li>Seller</li>
                            <li className="text-neutral-300">/</li>
                            <li className="text-neutral-600">
                                Products
                            </li>
                        </ol>
                    </nav>

                    <h1 className="text-[28px] font-semibold leading-none tracking-[-0.02em] text-neutral-950 sm:text-[34px]">
                        Your products
                    </h1>

                    <p className="mt-2 text-[13px] text-neutral-400">
                        Manage the products you've created.
                    </p>

                </div>

                {/* Search */}
                <div className="mb-1 border-y border-neutral-100 py-3.5">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-[36px] w-full max-w-md rounded-md border border-neutral-200 bg-neutral-50 px-3 text-[12px] text-neutral-900 placeholder:text-neutral-300 focus:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-100"
                    />
                </div>

                {/* Product count */}
                <div className="flex items-center justify-between py-4">

                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                        Products
                    </span>

                    <span className="text-[11px] text-neutral-400">
                        {filteredProducts.length} products
                    </span>

                </div>

                {/* Products */}
                <div className="border-t border-neutral-100">

                    {filteredProducts.length > 0 ? (

                        filteredProducts.map((product) => (

                            <div
                                key={product._id}
                                className="group border-b border-neutral-100 py-4 sm:py-5"
                            >

                                <div className="flex items-center gap-4 sm:gap-5">

                                    {/* Image */}
                                    <div className="h-[76px] w-[76px] shrink-0 overflow-hidden rounded-md bg-neutral-100 sm:h-[92px] sm:w-[92px]">

                                        <img
                                            src={product.images?.[0]?.url}
                                            alt={product.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                                        />

                                    </div>

                                    {/* Details */}
                                    <div className="min-w-0 flex-1">

                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                                            <div className="min-w-0">

                                                <h2 className="truncate text-[14px] font-medium text-neutral-900 sm:text-[15px]">
                                                    {product.title}
                                                </h2>

                                                <p className="mt-1 max-w-md truncate text-[12px] text-neutral-400">
                                                    {product.description}
                                                </p>

                                            </div>

                                            {/* Price */}
                                            <span className="shrink-0 text-[14px] font-medium tabular-nums text-neutral-900">

                                                {product.price.currency === "INR" && "₹"}
                                                {product.price.currency === "USD" && "$"}
                                                {product.price.currency === "EUR" && "€"}
                                                {product.price.currency === "JPY" && "¥"}
                                                {product.price.currency === "GBP" && "£"}

                                                {Number(
                                                    product.price.amount
                                                ).toLocaleString("en-IN")}

                                            </span>

                                        </div>

                                        {/* Metadata */}
                                        <div className="mt-3 flex items-center gap-3">

                                            <span className="text-[10px] text-neutral-500">
                                                Product
                                            </span>

                                            <span className="text-neutral-200">
                                                ·
                                            </span>

                                            <button
                                                onClick={() => { navigate(`/seller/edit/${product._id}`) }}
                                                type="button"
                                                className="text-[10px] text-neutral-400 transition-colors hover:text-neutral-800"
                                            >
                                                Edit
                                            </button>

                                        </div>

                                    </div>

                                    {/* More menu */}
                                    <div className="relative shrink-0">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setOpenMenu(
                                                    openMenu === product._id
                                                        ? null
                                                        : product._id
                                                )
                                            }
                                            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-300 transition-all duration-200 hover:bg-neutral-100 hover:text-neutral-800"
                                            aria-label="Product actions"
                                        >
                                            <svg
                                                className="h-4 w-4"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path d="M10 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                                            </svg>
                                        </button>

                                        {openMenu === product._id && (
                                            <div className="absolute right-0 top-9 z-30 w-32 overflow-hidden rounded-md border border-neutral-200 bg-white py-1 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">

                                                <button
                                                    type="button"
                                                    className="block w-full px-3 py-2 text-left text-[11px] text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-950"
                                                    onClick={() => {
                                                        setOpenMenu(null);
                                                        navigate(`/seller/edit/${product._id}`)
                                                    }}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="block w-full px-3 py-2 text-left text-[11px] text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-950"
                                                    onClick={() => {
                                                        setOpenMenu(null);
                                                        setDeleteProductId(product._id);
                                                    }}
                                                >
                                                    Delete
                                                </button>

                                            </div>
                                        )}

                                    </div>

                                </div>

                            </div>

                        ))

                    ) : (

                        <div className="py-20 text-center">

                            <h2 className="text-[14px] font-medium text-neutral-800">
                                No products found
                            </h2>

                            <p className="mt-1 text-[12px] text-neutral-400">
                                Create your first product to see it here.
                            </p>

                        </div>

                    )}

                </div>

            </main>

            {/* Delete Confirmation Modal */}
            {deleteProductId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-5 backdrop-blur-[2px]">

                    <div className="w-full max-w-[400px] rounded-[6px] border border-neutral-200 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">

                        <div className="mb-7">

                            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
                                Delete product
                            </p>

                            <h2 className="mt-3 text-[20px] font-medium tracking-[-0.03em] text-neutral-950">
                                Delete this product?
                            </h2>

                            <p className="mt-2 text-[12px] leading-5 text-neutral-400">
                                This action cannot be undone. The product will be permanently removed from your store.
                            </p>

                        </div>

                        <div className="flex items-center justify-end gap-3">

                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() => setDeleteProductId(null)}
                                className="h-9 rounded-[5px] px-4 text-[11px] font-medium text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-900 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={handleDelete}
                                className="flex h-9 min-w-[90px] items-center justify-center rounded-[5px] bg-[#111111] px-4 text-[11px] font-medium text-white transition-all duration-200 hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

export default Dashboard;