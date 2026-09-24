import { addItemToCartApi } from "../services/cart.api";

import { useDispatch } from "react-redux";
import { addItems as addItemToCart } from "../state/cart.slice";

export const useCart = () => {
    const dispatch = useDispatch();

    async function handleAddItem({
        productId,
        variantId,
        quantity,
    }) {
        const data = await addItemToCartApi({
            productId,
            variantId,
            quantity,
        });

        return data;
    }

    return {
        handleAddItem,
    };
};