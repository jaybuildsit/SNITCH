import { addItemToCartApi, getCartApi } from "../services/cart.api";

import { useDispatch } from "react-redux";
import { setItems } from "../state/cart.slice";

export const useCart = () => {
    const dispatch = useDispatch();

    async function handleAddItem({
        productId,
        variantId,
        quantity,
        size
    }) {
        const data = await addItemToCartApi({
            productId,
            variantId,
            quantity,
            size
        });

        return data;
    }
    async function handleGetCart() {
        const data = await getCartApi();

        dispatch(setItems(data.cart.items));

        return data.cart;
    }

    return {
        handleAddItem,
        handleGetCart
    };
};