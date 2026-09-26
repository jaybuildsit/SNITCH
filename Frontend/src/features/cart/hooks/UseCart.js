import { addItemToCartApi, getCartApi, updateCartItemApi, removeCartItemApi ,createCartOrder,verifyCartOrder} from "../services/cart.api";

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

        dispatch(setItems(data.cart.items));

        return data;
    }
    async function handleGetCart() {
        const data = await getCartApi();

        dispatch(setItems(data.cart.items));

        return data.cart;
    }

    async function handleUpdateCartItem({
        itemId,
        quantity
    }) {
        const data = await updateCartItemApi({
            itemId,
            quantity
        });

        dispatch(setItems(data.cart.items));

        return data.cart;
    }

    async function handleRemoveCartItem(itemId) {
        const data = await removeCartItemApi(itemId);

        dispatch(setItems(data.cart.items));

        return data.cart;
    }

    async function handleCreateCartOrder() {
        const data = await createCartOrder();

        return data.order;
    }

    async function handleVerifyCartOrder({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    }) {
        const data = await verifyCartOrder({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        });

        return data;
    }

  

    return {
        handleAddItem,
        handleGetCart,
        handleUpdateCartItem,
        handleRemoveCartItem,
        handleCreateCartOrder,
        handleVerifyCartOrder
    };
};