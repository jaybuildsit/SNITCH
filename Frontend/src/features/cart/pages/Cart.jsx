import React from 'react'
import { useEffect } from "react";
import { useCart } from "../hooks/UseCart";

const Cart = () => {


    const { handleGetCart } = useCart();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const cart = await handleGetCart();

                // console.log("CART FROM DATABASE:", cart);
                // console.log("CART ITEMS:", cart.items);
            } catch (error) {
                console.error(
                    "GET CART ERROR:",
                    error.response?.data || error
                );
            }
        };

        fetchCart();
    }, []);
    return (
        <div>Cart</div>
    )
}

export default Cart