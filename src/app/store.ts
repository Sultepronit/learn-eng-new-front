import { configureStore } from "@reduxjs/toolkit";
import statusReducer from "../features/status/statusSlice";
import cardsReducer from "../features/cards/cardsSlice";
import listReducer from "../features/list/listSlice";
import tapReducer from "../features/tap/tapSlice";
import writeReducer from "../features/write/writeSlice";
import pronunciationReducer from "../features/pronunciation/pronunciationSlice";
import { listenerMiddleware } from "./listeners";
import { useDispatch } from "react-redux";

export const store = configureStore({
    reducer: {
        status: statusReducer,
        cards: cardsReducer,
        list: listReducer,
        tap: tapReducer,
        write: writeReducer,
        pronunciation: pronunciationReducer
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().prepend(listenerMiddleware.middleware) 
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();