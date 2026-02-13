import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type RecordData = {
    url: string,
    type: string,
    code: string
}

type PronState = {
    list: Array<RecordData[]>
}

const initialState: PronState = {
    list: []
}

const pronunciationSlice = createSlice({
    name: 'pronunciation',
    initialState,
    reducers: {
        setPronList(state, action: PayloadAction<Array<RecordData[]>>) {
            state.list = action.payload;
        }
    }
});

export const { setPronList } = pronunciationSlice.actions;

export const selecProntList = (state) => state.pronunciation.list;

export default pronunciationSlice.reducer;