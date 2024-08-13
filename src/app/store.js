import { configureStore } from "@reduxjs/toolkit";
import apiReducer from "../features/api/apiSlice";
import listReducer from "../features/list/listSlice";

export const store = configureStore({
    reducer: {
        api: apiReducer,
        list: listReducer
    }
});