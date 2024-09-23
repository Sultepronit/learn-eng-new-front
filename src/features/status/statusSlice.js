import { createSlice } from "@reduxjs/toolkit";

const statusSlice = createSlice({
    name: 'status',
    initialState: {
        status: 'idle',
        error: '',
        requestCounter: 0
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher((action) => action.meta?.requestStatus, (state, action) => {
            // console.log(action);
            const newStatus = action.meta.requestStatus;
            if(newStatus === 'pending') {
                state.requestCounter++;
            } else {
                state.requestCounter--;
            }

            // console.log('Pending requests:', state.requestCounter);

            if(newStatus === 'pending' && state.status === 'idle') {
                state.status = 'loading';
            } else if(newStatus === 'fulfilled' && state.requestCounter === 0) {
                state.status = 'idle';
            } else if(newStatus === 'rejected') {
                state.status = 'error';
                console.log(action);
            }
        })
        // .addMatcher(action => true, (state, action) => {
        //     console.log(action);
        // });
    }
});

export const getStatus = (state) => state.status.status;

export default statusSlice.reducer;