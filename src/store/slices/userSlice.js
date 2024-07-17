import { createSlice } from '@reduxjs/toolkit'


const userSlice = createSlice({
    name: 'user',
    initialState: {

        userDetails: {
            user_id: '',
            user_name: '',
            user_role: '',
            work_email: '',
            token: '',
        } 
    },
    reducers: {
        setUserDetails: (state, action) => { 
            state.userDetails.user_id = action.payload.user_id
            state.userDetails.user_name = action.payload.emp_name
            state.userDetails.user_role = action.payload.user_role
            state.userDetails.work_email = action.payload.email
            state.userDetails.token = action.payload.token
        }
    }
})


export const { setUserDetails } = userSlice.actions
export default userSlice.reducer
 