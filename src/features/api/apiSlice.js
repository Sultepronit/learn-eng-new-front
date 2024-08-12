import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    db: [],
    status: 'idle',
    error: ''
};

async function retry(callback, ...args) {   
    return new Promise(resolve => {
        setTimeout(async () => {
            resolve(await callback(...args));
        }, 5 * 1000);
    });
}

async function fetchWithFeatures(path, method, inputData, refetch = true) {
    const apiUrl = import.meta.env.VITE_API_URL;
        
    const options = {
        method,
        body: inputData ? JSON.stringify(inputData) : null
    };

    try {
        const response = await fetch(apiUrl + path, options);
        return await response.json();
    } catch (error) {
        if(refetch) {
            return await retry(fetchWithFeatures, path, method, inputData, refetch);
        } else {
            throw new Error('No connection!');
        }
    }
}

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