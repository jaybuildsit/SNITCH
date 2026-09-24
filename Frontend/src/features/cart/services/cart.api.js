import axios from "axios";

const cartApiInstance = axios.create({
    baseURL: "/api/cart",
    withCredentials: true,
});

export const addItemToCartApi = async ({
    productId,
    variantId,
    quantity,
}) => {
    const response = await cartApiInstance.post(
        `/add/${productId}`,
        {
            variantId,
            quantity,
        }
    );

    return response.data;
};
// export const getCartApi=async()=>{
//     const response =await cartApiInstance.get("/")
//     return response.data
// }

// export const updateCartApi=async(item)=>{
//     const response =await cartApiInstance.put("/")
//     return response.data
// }

// export const deleteCartApi=async(item)=>{
//     const response =await cartApiInstance.delete("/")
//     return response.data
// }