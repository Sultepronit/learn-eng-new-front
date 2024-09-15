import { configureStore } from "@reduxjs/toolkit";
// import apiReducer from "../features/api/apiSlice";
import statusReducer from "../features/status/statusSlice";
import listReducer from "../features/list/listSlice";
import cardsReducer from "../features/cards/cardsSlice";

export const store = configureStore({
    reducer: {
        status: statusReducer,
        cards: cardsReducer,
        list: listReducer,
    }
});