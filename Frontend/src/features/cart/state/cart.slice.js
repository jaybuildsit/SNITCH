import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    totalAmount: 0,
    totalQuantity: 0,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setItems: (state, action) => {
            state.items = action.payload;
        },
        addItems: (state, action) => {
            state.items.push(action.payload)
        }
    },
});

export const { setItems, addItems } = cartSlice.actions;
export default cartSlice.reducer;
