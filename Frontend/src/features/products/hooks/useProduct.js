import { createProduct, getSellerProduct } from "../services/product.api";
import { useDispatch } from "react-redux";
import { setSellerProducts } from "../state/product.slice";


// export function useProduct(){
//     const dispatch = useDispatch()

//     async function handleCreateProduct(formdata){
//         dispatch(createProduct(formdata))
//     }

//     async function handleGetSellerProduct(){
//         dispatch(getSellerProduct())
//     }

//     return {
//         handleCreateProduct,
//         handleGetSellerProduct
//     }
// }


export const useProduct = () => {

    const dispatch = useDispatch()

    async function handleCreateProduct(formdata) {

        const data = await createProduct(formdata)
        return data.product

    }

    async function handleGetSellerProduct() {
        const data = await getSellerProduct()
        dispatch(setSellerProducts(data.products))
        return data.products 
    }

    return {
        handleCreateProduct,
        handleGetSellerProduct
    }
}