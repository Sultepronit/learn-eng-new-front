import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetchWithFeatures from "../../services/fetchWithFeatures";

const emptyCard = {
    main: {
        number: 0,
        word: ''
    }
}

export const fetchData = createAsyncThunk('data/fetchData', async () => {
    return await fetchWithFeatures('/words');
});

const listSlice = createSlice({
    name: 'list',
    initialState: {
        data: [],
        selectedCard: emptyCard
    },
    reducers: {
        selectCard: (state, action) => { // rename to setSelectedCard!
            state.selectedCard = action.payload
            // console.log(action);
            console.log(state.selectedCard);
        },
        selectCardByNumber: (state, action) => {
            const inputIndex = Math.round(action.payload - 1); // card number is data array index + 1
            const lastIndex = state.data.length - 1;
            const index = inputIndex < 0 ? 0 : inputIndex > lastIndex ? lastIndex : inputIndex;

            state.selectedCard = state.data[index];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchData.fulfilled, (state, action) => {
                state.data = action.payload;
            });
    }
});

export const selectData = (state) => state.list.data;
export const getSelectedCard = (state) => state.list.selectedCard;

export const { selectCard, selectCardByNumber } = listSlice.actions;

export default listSlice.reducer;