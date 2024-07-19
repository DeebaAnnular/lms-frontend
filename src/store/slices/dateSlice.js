import { createSlice } from "@reduxjs/toolkit";

const dateSlice = createSlice({
    name: 'date',
    initialState: {
        input_date: {
            from_date: '',
            to_date: '',
            week_id: ''
        }
    },
    reducers: {
        setDate: (state, action) => {
            console.log(action.payload)
            state.input_date = {
                from_date: action.payload.from_date,
                to_date: action.payload.to_date,
                week_id: action.payload.week_id
            };
        }
    }
});

export const { setDate } = dateSlice.actions;
export default dateSlice.reducer;
