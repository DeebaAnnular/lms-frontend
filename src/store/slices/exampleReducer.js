import { createSlice } from "@reduxjs/toolkit";

const exampleReducer = createSlice({
    name:'example',
    initialState:{
        value:0
    },
    reducers:{
        increament : state => state.value += 1,
        decreament : state => state.value -+ 1
    }
})

export const { increament, decreament } = exampleReducer.actions
export default exampleReducer.reducer