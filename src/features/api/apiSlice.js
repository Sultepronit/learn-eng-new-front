import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetchWithFeatures from "../../services/fetchWithFeatures";

const initialState = {
    db: [],
    status: 'idle',
    error: ''
};

export const fetchDb = createAsyncThunk('db/fetchDb', async () => {
    return await fetchWithFeatures('/words');
});

const apiSlice = createSlice({
    name: 'api',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDb.fulfilled, (state, action) => {
                state.db = action.payload;
            })
            .addMatcher((action) => action.meta?.requestStatus, (state, action) => {
                const statusToStatus = {
                    pending: 'loading',
                    fulfilled: 'idle',
                    rejected: 'failed'
                };
                state.status = statusToStatus[action.meta.requestStatus];
            });
    }
});

export const selectDb = (state) => state.api.db;
export const getStatus = (state) => state.api.status;

export default apiSlice.reducer;