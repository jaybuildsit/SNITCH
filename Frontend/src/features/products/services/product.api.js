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

export async function getAllProducts() {
    const response = await productApiInstance.get("/");

    return response.data;
}

export async function getProductById(productId) {
    const response = await productApiInstance.get(`/${productId}`);

    return response.data;
}

export async function updateProduct(productId, productData) {
    const response = await productApiInstance.put(
        `/${productId}`,
        productData
    );

    return response.data;
}

export async function uploadProductImage(file) {
    const formData = new FormData();
    formData.append("image", file);

    const response = await productApiInstance.post("/upload-image", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}

export default productApiInstance;