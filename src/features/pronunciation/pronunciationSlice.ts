import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PronList, RecordData } from "./types";


type PronState = {
    // list: Array<RecordData[]>
    list: PronList[]
}

const initialState: PronState = {
    list: []
}

const pronunciationSlice = createSlice({
    name: 'pronunciation',
    initialState,
    reducers: {
        setPronList(state, action: PayloadAction<PronList[]>) {
            state.list = action.payload;
            console.log(action.payload)
        },
        setCurrentIndex(state, action: PayloadAction<{ variantI : number, trackI : number }>) {
            const { variantI, trackI } = action.payload;
            const variant = state.list[variantI];
            variant.currentIndex = trackI;
        },
        setStale(state, action: PayloadAction<number>) {
            state.list[action.payload].isStale = true;
        },
    }
});

export const {
    setPronList,
    setCurrentIndex,
    setStale
} = pronunciationSlice.actions;

export const selectPronList = (state) => state.pronunciation.list;

export default pronunciationSlice.reducer;