import React, { useEffect, useState } from 'react';
import { useProduct } from '../hooks/useProduct';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

const Dashboard = () => {
    const navigate = useNavigate();


    // console.log(sellerProducts)

    const { handleGetSellerProduct } = useProduct();

    const sellerProducts = useSelector(
        (state) => state.product.sellerProducts
    );

    console.log(
        "SELLER PRODUCTS:",
        JSON.stringify(sellerProducts, null, 2)
    );

    const [search, setSearch] = useState('');

    useEffect(() => {
        handleGetSellerProduct();
    }, []);

    const products = Array.isArray(sellerProducts)
        ? sellerProducts
        : [];

    const filteredProducts = products.filter((product) =>
        product?.title?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">

            {/* Navigation */}
            <header className="border-b border-neutral-100 sticky top-0 bg-white/95 backdrop-blur-sm z-20">
                <div className="max-w-5xl mx-auto px-5 sm:px-8 h-[52px] flex items-center justify-between">

                    <div className="flex items-center gap-2.5">
                        <span className="text-[13px] font-bold tracking-[0.18em] uppercase text-neutral-950">
                            SNITCH
                        </span>

                        <span className="text-neutral-300 text-xs">
                            ·
                        </span>

                        <span className="text-[11px] text-neutral-400 tracking-wide">
                            Seller Studio
                        </span>
                    </div>

                    <button
                        type="button"
                        className="text-[11px] font-medium text-neutral-600 hover:text-neutral-950 transition-colors"
                        onClick={() => navigate('/seller/products/create')}
                    >
                        + Add product
                    </button>

                </div>
            </header>


            {/* Main */}
            <main className="max-w-5xl mx-auto px-5 sm:px-8 pt-9 pb-20">

                {/* Header */}
                <div className="mb-8">

                    <nav className="mb-3">
                        <ol className="flex items-center gap-1.5 text-[11px] tracking-wide text-neutral-400">
                            <li>Seller</li>
                            <li className="text-neutral-300">/</li>
                            <li className="text-neutral-600">Products</li>
                        </ol>
                    </nav>

                    <h1 className="text-[28px] sm:text-[34px] font-semibold tracking-[-0.02em] leading-none text-neutral-950">
                        Your products
                    </h1>

                    <p className="text-[13px] text-neutral-400 mt-2">
                        Manage the products you've created.
                    </p>

                </div>


                {/* Search */}
                <div className="border-y border-neutral-100 py-3.5 mb-1">

                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full max-w-md h-[36px] px-3 text-[12px] bg-neutral-50 border border-neutral-200 rounded-md text-neutral-900 placeholder:text-neutral-300 focus:outline-none focus:border-neutral-700 focus:ring-2 focus:ring-neutral-100"
                    />

                </div>


                {/* Product count */}
                <div className="flex items-center justify-between py-4">

                    <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-neutral-400">
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
                                    <div className="w-[76px] h-[76px] sm:w-[92px] sm:h-[92px] shrink-0 overflow-hidden rounded-md bg-neutral-100">

                                        <img
                                            src={product.images?.[0]?.url}
                                            alt={product.title}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                                        />

                                    </div>


                                    {/* Details */}
                                    <div className="min-w-0 flex-1">

                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">

                                            <div className="min-w-0">

                                                <h2 className="text-[14px] sm:text-[15px] font-medium text-neutral-900 truncate">
                                                    {product.title}
                                                </h2>

                                                <p className="text-[12px] text-neutral-400 mt-1 truncate max-w-md">
                                                    {product.description}
                                                </p>

                                            </div>


                                            {/* Price */}
                                            <span className="shrink-0 text-[14px] font-medium text-neutral-900 tabular-nums">
                                                {product.price.currency === 'INR' && '₹'}
                                                {product.price.currency === 'USD' && '$'}
                                                {product.price.currency === 'EUR' && '€'}
                                                {product.price.currency === 'JPY' && '¥'}
                                                {product.price.currency === 'GBP' && '£'}
                                                {Number(product.price.amount).toLocaleString('en-IN')}
                                            </span>

                                        </div>


                                        {/* Metadata */}
                                        <div className="flex items-center gap-3 mt-3">

                                            <span className="text-[10px] text-neutral-500">
                                                Product
                                            </span>

                                            <span className="text-neutral-200">
                                                ·
                                            </span>

                                            <button
                                                type="button"
                                                className="text-[10px] text-neutral-400 hover:text-neutral-800 transition-colors"
                                            >
                                                Edit
                                            </button>

                                        </div>

                                    </div>


                                    {/* More */}
                                    <button
                                        type="button"
                                        className="shrink-0 w-7 h-7 flex items-center justify-center text-neutral-300 hover:text-neutral-700 transition-colors"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M10 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                                        </svg>
                                    </button>

                                </div>

                            </div>

                        ))

                    ) : (

                        <div className="py-20 text-center">

                            <h2 className="text-[14px] font-medium text-neutral-800">
                                No products found
                            </h2>

                            <p className="text-[12px] text-neutral-400 mt-1">
                                Create your first product to see it here.
                            </p>

                        </div>

                    )}

                </div>

            </main>
        </div>
    );
};

export default Dashboard;