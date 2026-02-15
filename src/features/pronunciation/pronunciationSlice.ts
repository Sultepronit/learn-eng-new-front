import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PronList } from "./types";


type PronState = {
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
        setTrackIndex(state, action: PayloadAction<{ variantI : number, trackI : number }>) {
            const { variantI, trackI } = action.payload;
            // console.log(variantI, trackI)
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
    setTrackIndex,
    setStale
} = pronunciationSlice.actions;

export const selectPronList = (state) => state.pronunciation.list;

export default pronunciationSlice.reducer;