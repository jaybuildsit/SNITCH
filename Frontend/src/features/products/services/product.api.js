import axios from "axios";

const productApiInstance = axios.create({
    baseURL: "/api/products",
    withCredentials: true,
});

export async function createProduct(formdata) {
    const response = await productApiInstance.post("/", formdata);

    return response.data;
}

export async function getSellerProduct() {
    const response = await productApiInstance.get("/seller");

    return response.data;
}

export async function deleteProduct(productId) {
    const response = await productApiInstance.delete(`/${productId}`);

    return response.data;
}

export async function getAllProducts(){
    const response = await productApiInstance.get("/");

    return response.data;
}

export default productApiInstance;