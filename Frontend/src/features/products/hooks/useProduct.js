import {
    createProduct,
    getSellerProduct,
    deleteProduct,
} from "../services/product.api";

import { useDispatch } from "react-redux";
import { setSellerProducts } from "../state/product.slice";

export const useProduct = () => {
    const dispatch = useDispatch();

    async function handleCreateProduct(formdata) {
        const data = await createProduct(formdata);
        return data.product;
    }

    async function handleGetSellerProduct() {
        const data = await getSellerProduct();

        dispatch(setSellerProducts(data.products));

        return data.products;
    }

    async function handleDeleteProduct(productId) {
        const data = await deleteProduct(productId);

        await handleGetSellerProduct();

        return data;
    }

    return {
        handleCreateProduct,
        handleGetSellerProduct,
        handleDeleteProduct,
    };
};