import { combineReducers } from '@reduxjs/toolkit'; 
import userSlice from './slices/userSlice'
import dateSlice from './slices/dateSlice' 

const rootReducer = combineReducers({
    date : dateSlice,
    user:userSlice
})   

export default rootReducer