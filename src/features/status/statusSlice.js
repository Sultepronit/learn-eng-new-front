import { createSlice } from "@reduxjs/toolkit";

const statusSlice = createSlice({
    name: 'status',
    initialState: {
        status: 'idle',
        error: ''
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher((action) => action.meta?.requestStatus, (state, action) => {
            // console.log(action);
            const statusToStatus = {
                pending: 'loading',
                fulfilled: 'idle',
                rejected: 'failed'
            };
            state.status = statusToStatus[action.meta.requestStatus];
        });
    }
});

export const getStatus = (state) => state.status.status;

export default statusSlice.reducer;