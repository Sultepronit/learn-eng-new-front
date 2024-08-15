import { configureStore } from "@reduxjs/toolkit";
// import apiReducer from "../features/api/apiSlice";
import statusReducer from "../features/status/statusSlice";
import listReducer from "../features/list/listSlice";

export const store = configureStore({
    reducer: {
        // api: apiReducer,
        status: statusReducer,
        list: listReducer
    }
});