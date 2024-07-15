import { combineReducers } from '@reduxjs/toolkit';
import exampleReducer from './slices/exampleReducer'
import userSlice from './slices/userSlice' 

const rootReducer = combineReducers({
    example : exampleReducer,
    user:userSlice
})   

export default rootReducer