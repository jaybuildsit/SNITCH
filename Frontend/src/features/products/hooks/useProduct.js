import {
    createProduct,
    getSellerProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct
    
} from "../services/product.api";

import { useDispatch } from "react-redux";
import { setSellerProducts, setProducts } from "../state/product.slice";

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

    async function handleGetAllProducts() {
        const data = await getAllProducts();
        dispatch(setProducts(data.products))

        return data.products
    }

    async function handleGetProductById(productId) {
        const data = await getProductById(productId);

        return data.product;
    }

    async function handleUpdateProduct(productId, productData) {
        const data = await updateProduct(productId, productData);

        return data;
    }
    async function handleUpdateProduct(productId, productData) {
        const data = await updateProduct(productId, productData);

        return data;
    }


    // const handleSaveChanges = async () => {
    //     try {
    //         setSaving(true);

    //         await handleUpdateProduct(id, product);

    //         setSaved(true);

    //         setTimeout(() => {
    //             navigate("/seller/dashboard");
    //         }, 800);

    //     } catch (error) {
    //         console.log("Failed to save changes!", error);
    //     } finally {
    //         setSaving(false);
    //     }
    // };



    return {
        handleCreateProduct,
        handleGetSellerProduct,
        handleDeleteProduct,
        handleGetAllProducts,
        handleGetProductById,
        handleUpdateProduct,

    };
};