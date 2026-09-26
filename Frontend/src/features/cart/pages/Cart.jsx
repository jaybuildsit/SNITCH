import React, { useEffect, useState } from "react";
import { useCart } from "../hooks/UseCart";
import { useRazorpay } from "react-razorpay";

const Cart = () => {
    const {
        handleGetCart,
        handleUpdateCartItem,
        handleRemoveCartItem,
    } = useCart();

    const { error, isLoading, Razorpay } = useRazorpay();

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingItem, setUpdatingItem] = useState(null);
    const [removingItem, setRemovingItem] = useState(null);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const data = await handleGetCart();
                setCart(data);
            } catch (error) {
                console.error(
                    "GET CART ERROR:",
                    error.response?.data || error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    console.log(cart);

    const handleQuantityChange = async (item, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            setUpdatingItem(item._id);

            await handleUpdateCartItem({
                itemId: item._id,
                quantity: newQuantity,
            });

            // Fetch fresh populated cart
            const freshCart = await handleGetCart();

            setCart(freshCart);

        } catch (error) {
            console.error(
                "UPDATE CART ERROR:",
                error.response?.data || error
            );
        } finally {
            setUpdatingItem(null);
        }
    };

    const handleRemove = async (itemId) => {
        try {
            setRemovingItem(itemId);

            await handleRemoveCartItem(itemId);

            // Fetch fresh populated cart
            const freshCart = await handleGetCart();

            setCart(freshCart);

        } catch (error) {
            console.error(
                "REMOVE CART ERROR:",
                error.response?.data || error
            );
        } finally {
            setRemovingItem(null);
        }
    };

    const handlePayment = () => {
        const options = {
            key: "rzp_test_TgeB0HSHAcYW1Q",
            amount: 50000, // Amount in paise
            currency: "INR",
            name: "Test Company",
            description: "Test Transaction",
            order_id: "order_9A33XWu170gUtm", // Generate order_id on server
            handler: (response) => {
                console.log(response);
                alert("Payment Successful!");
            },
            prefill: {
                name: "John Doe",
                email: "john.doe@example.com",
                contact: "9999999999",
            },
            theme: {
                color: "#F37254",
            },
        };

        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open();
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-[#f7f7f5] px-6 py-16">
                <div className="mx-auto max-w-7xl animate-pulse">
                    <div className="h-10 w-40 bg-black/10" />

                    <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_380px]">
                        <div className="space-y-4">
                            {[1, 2].map((item) => (
                                <div
                                    key={item}
                                    className="h-48 bg-black/5"
                                />
                            ))}
                        </div>

                        <div className="h-72 bg-black/5" />
                    </div>
                </div>
            </main>
        );
    }

    const items = cart?.items || [];

    const subtotal = items.reduce((total, item) => {
        return total + (item.price?.amount || 0) * item.quantity;
    }, 0);

    const totalQuantity = items.reduce(
        (total, item) => total + item.quantity,
        0
    );

    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-[#f7f7f5] px-6 py-20">
                <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center">
                    <div className="text-center">
                        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.3em] text-black/45">
                            Your cart
                        </p>

                        <h1 className="text-5xl font-light tracking-[-0.04em] text-black md:text-7xl">
                            Nothing here.
                        </h1>

                        <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-black/55">
                            Your cart is waiting for something worth wearing.
                        </p>

                        <button className="mt-10 border border-black bg-black px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-white transition hover:bg-black/85">
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f7f7f5] px-5 py-12 md:px-8 md:py-16 lg:px-12">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="flex items-end justify-between border-b border-black/10 pb-7">
                    <div>
                        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-black/45">
                            Shopping bag
                        </p>

                        <h1 className="text-5xl font-light tracking-[-0.05em] text-black md:text-7xl">
                            Your Cart
                        </h1>
                    </div>

                    <span className="hidden text-xs uppercase tracking-[0.2em] text-black/45 md:block">
                        {totalQuantity}{" "}
                        {totalQuantity === 1 ? "Item" : "Items"}
                    </span>
                </div>

                {/* Content */}
                <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">

                    {/* Cart Items */}
                    <section>
                        <div className="divide-y divide-black/10">
                            {items.map((item) => {
                                const product = item.product;

                                const productImage =
                                    item.product?.variants?.images?.[0]?.url ||
                                    product?.images?.[0]?.url;

                                const productName =
                                    product?.title || "Product";

                                const itemPrice =
                                    item.price?.amount || 0;

                                return (
                                    <article
                                        key={item._id}
                                        className="group py-7 first:pt-0"
                                    >
                                        <div className="flex gap-5 md:gap-8">

                                            {/* Image */}
                                            <div className="h-36 w-28 shrink-0 overflow-hidden bg-[#e9e9e6] md:h-48 md:w-36">
                                                {productImage ? (
                                                    <img
                                                        src={productImage}
                                                        alt={productName}
                                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-[9px] uppercase tracking-widest text-black/30">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="flex min-w-0 flex-1 flex-col justify-between">

                                                <div className="flex justify-between gap-4">
                                                    <div>
                                                        <h2 className="text-base font-medium tracking-[-0.02em] text-black md:text-lg">
                                                            {productName}
                                                        </h2>

                                                        <div className="mt-2 space-y-1 text-xs text-black/50">
                                                            {item.size && (
                                                                <p>
                                                                    Size:{" "}
                                                                    <span className="text-black/75">
                                                                        {item.size}
                                                                    </span>
                                                                </p>
                                                            )}

                                                            {item.product?.variants?.attributes?.color && (
                                                                <p>
                                                                    Variant:{" "}
                                                                    <span className="text-black/75">
                                                                        {item.product.variants.attributes.color}
                                                                    </span>
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Remove */}
                                                    <button
                                                        onClick={() =>
                                                            handleRemove(
                                                                item._id
                                                            )
                                                        }
                                                        disabled={
                                                            removingItem ===
                                                            item._id
                                                        }
                                                        className="text-[10px] uppercase tracking-[0.18em] text-black/40 transition hover:text-black disabled:opacity-30"
                                                    >
                                                        {removingItem ===
                                                            item._id
                                                            ? "Removing"
                                                            : "Remove"}
                                                    </button>
                                                </div>

                                                <div className="mt-7 flex items-end justify-between">

                                                    {/* Quantity */}
                                                    <div className="flex h-10 items-center border border-black/15">
                                                        <button
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    item,
                                                                    item.quantity -
                                                                    1
                                                                )
                                                            }
                                                            disabled={
                                                                item.quantity <=
                                                                1 ||
                                                                updatingItem ===
                                                                item._id
                                                            }
                                                            className="flex h-full w-10 items-center justify-center text-lg font-light transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                                                        >
                                                            −
                                                        </button>

                                                        <span className="flex h-full w-10 items-center justify-center border-x border-black/15 text-xs">
                                                            {updatingItem ===
                                                                item._id
                                                                ? "..."
                                                                : item.quantity}
                                                        </span>

                                                        <button
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    item,
                                                                    item.quantity +
                                                                    1
                                                                )
                                                            }
                                                            disabled={
                                                                updatingItem ===
                                                                item._id
                                                            }
                                                            className="flex h-full w-10 items-center justify-center text-lg font-light transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    {/* Price */}
                                                    <p className="text-sm font-medium">
                                                        {item.price?.currency ||
                                                            "INR"}{" "}
                                                        {(
                                                            itemPrice *
                                                            item.quantity
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>

                    {/* Summary */}
                    <aside className="lg:sticky lg:top-8 lg:self-start">
                        <div className="border-t border-black pt-6">

                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium tracking-[-0.02em]">
                                    Order Summary
                                </h2>

                                <span className="text-xs text-black/45">
                                    {totalQuantity} items
                                </span>
                            </div>

                            <div className="mt-8 space-y-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-black/50">
                                        Subtotal
                                    </span>

                                    <span>
                                        ₹{" "}
                                        {subtotal.toLocaleString("en-IN")}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-black/50">
                                        Shipping
                                    </span>

                                    <span className="text-xs uppercase tracking-wider">
                                        Free
                                    </span>
                                </div>
                            </div>

                            <div className="my-7 border-t border-black/10" />

                            <div className="flex items-end justify-between">
                                <span className="text-sm text-black/50">
                                    Total
                                </span>

                                <span className="text-2xl font-medium tracking-[-0.03em]">
                                    ₹ {subtotal.toLocaleString("en-IN")}
                                </span>
                            </div>

                            <button
                            onClick={handlePayment}
                             className="mt-8 flex h-14 w-full items-center justify-center bg-black text-xs font-medium uppercase tracking-[0.22em] text-white transition hover:bg-black/85">
                                Proceed to Checkout
                            </button>

                            <p className="mt-4 text-center text-[10px] uppercase tracking-[0.15em] text-black/35">
                                Secure checkout
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
};

export default Cart;