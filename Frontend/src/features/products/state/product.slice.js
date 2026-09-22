import { createSlice } from "@reduxjs/toolkit";

 const productSlice=createSlice({
    name:"product",
    initialState:{
        sellerProducts:[],
        Products:[]
        
    },
    reducers:{
        setSellerProducts:(state,action)=>{
            state.sellerProducts=action.payload
        },
        setProducts:(state,action)=>{
            state.Products=action.payload
        },


    }
})

export const {setSellerProducts,setProducts} = productSlice.actions
export default productSlice.reducer