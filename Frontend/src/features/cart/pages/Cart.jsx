import React, { useEffect, useState } from "react";
import { useCart } from "../hooks/UseCart";

const Cart = () => {
    const { handleGetCart, handleUpdateCartItem, handleRemoveCartItem } = useCart();

    const [cart, setCart] = useState(null);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const data = await handleGetCart();

                setCart(data);

                console.log("CART FROM DATABASE:", data);
                console.log("CART ITEMS:", data.items);
            } catch (error) {
                console.error(
                    "GET CART ERROR:",
                    error.response?.data || error
                );
            }
        };

        fetchCart();
    }, []);

    // const testUpdate = async () => {
    //     try {
    //         const firstItem = cart?.items?.[0];

    //         if (!firstItem) {
    //             console.log("No cart items found");
    //             return;
    //         }

    //         console.log("UPDATING ITEM:", firstItem._id);

    //         const updatedCart = await handleUpdateCartItem({
    //             itemId: firstItem._id,
    //             quantity: 2,
    //         });

    //         console.log("UPDATED CART:", updatedCart);

    //         setCart(updatedCart);
    //     } catch (error) {
    //         console.error(
    //             "UPDATE CART ERROR:",
    //             error.response?.data || error
    //         );
    //     }
    // };

    // const testRemove = async () => {
    //     try {
    //         const firstItem = cart?.items?.[0];

    //         if (!firstItem) {
    //             console.log("No cart items found");
    //             return;
    //         }

    //         console.log("REMOVING ITEM:", firstItem._id);

    //         const updatedCart = await handleRemoveCartItem(firstItem._id);

    //         console.log("CART AFTER REMOVE:", updatedCart);

    //         setCart(updatedCart);
    //     } catch (error) {
    //         console.error(
    //             "REMOVE CART ERROR:",
    //             error.response?.data || error
    //         );
    //     }
    // };

    return (
        <div>
            <h1>Cart</h1>

            <button onClick={testUpdate}>
                Test Update Quantity
            </button>

            <button onClick={testRemove}>
                Test Remove Item
            </button>

        </div>
    );
};

export default Cart;