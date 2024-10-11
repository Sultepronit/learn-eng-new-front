import { configureStore } from "@reduxjs/toolkit";
import statusReducer from "../features/status/statusSlice";
import cardsReducer from "../features/cards/cardsSlice";
import listReducer from "../features/list/listSlice";
import tapReducer from "../features/tap/tapSlice";
import pronunciationReducer from "../features/pronunciation/pronunciationSlice";

export const store = configureStore({
    reducer: {
        status: statusReducer,
        cards: cardsReducer,
        list: listReducer,
        tap: tapReducer,
        pronunciation: pronunciationReducer
    }
});