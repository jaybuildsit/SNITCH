import axios from "axios";

const cartApiInstance = axios.create({
    baseURL: "/api/cart",
    withCredentials: true,
});

export const addItemToCartApi = async ({
    productId,
    variantId,
    quantity,
    size
}) => {
    const response = await cartApiInstance.post(
        `/add/${productId}`,
        {
            variantId,
            size,
            quantity,
        }
    );

    return response.data;
};
export const getCartApi = async () => {
    const response = await cartApiInstance.get("/");

    return response.data;
};

export const updateCartItemApi = async ({
    itemId,
    quantity
}) => {
    const response = await cartApiInstance.patch(
        `/update/${itemId}`,
        {
            quantity
        }
    );

    return response.data;
};

export const removeCartItemApi = async (itemId) => {
    const response = await cartApiInstance.delete(
        `/remove/${itemId}`
    );

    return response.data;
};

export const createCartOrder = async ()=>{
    const response = await cartApiInstance.post("/payment/create/order");

    return response.data;
};

export const verifyCartOrder = async({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
}) => {
    const response = await cartApiInstance.post("/payment/verify/order", {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    });

    return response.data;
};