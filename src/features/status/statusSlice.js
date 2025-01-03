import { createSlice } from "@reduxjs/toolkit";
import logProxy from "../../dev-helpers/logProxy";

const statusSlice = createSlice({
    name: 'status',
    initialState: {
        status: 'idle',
        error: '',
        requestCounter: 0,
        implementingResotredUpdates: true
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

            if (action.type?.split('/')[1] === 'implementResotredUpdates') {
                if (newStatus === 'pending') {
                    state.implementingResotredUpdates = true;
                } else if (newStatus === 'fulfilled') {
                    state.implementingResotredUpdates = false;
                    // console.log(state);
                    // logProxy(state);
                    // console.log('implemented!');
                }
            }
        })
        // .addMatcher(action => true, (state, action) => {
        //     console.log(action);
        // });
    }
});

export const getStatus = (state) => state.status.status;
export const selectImplementingResotredUpdates = (state) => state.status.implementingResotredUpdates;

export default statusSlice.reducer;