import { createSlice } from '@reduxjs/toolkit'


const userSlice = createSlice({
    name: 'user',
    initialState: {

        userDetails: {
            user_id: '',
            user_name: '',
            user_type: '',
            work_email: '',
            token: '',
        } 
    },
    reducers: {
        setUserDetails: (state, action) => {
            console.log(action.payload)
            state.userDetails.user_id = action.payload.user_id
            state.userDetails.user_name = action.payload.emp_name
            state.userDetails.user_type = action.payload.user_role
            state.userDetails.work_email = action.payload.email
            state.userDetails.token = action.payload.token
        }
    }
})


export const { setUserDetails } = userSlice.actions
export default userSlice.reducer
 