import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import fetchWithFeatures from "../../services/fetchWithFeatures";
import logProxy from "../../dev-helpers/logProxy";

const emptyCard = {
    number: 0,
    main: {
        word: ''
    }
}

export const fetchData = createAsyncThunk('data/fetchData', async () => {
    return await fetchWithFeatures('/words');
});

export const updateCard = createAsyncThunk('data/updateCard', async ({ id, changes }) => {
    console.log('Here we go!');
    return await fetchWithFeatures(`/words/${id}`, 'PATCH', JSON.stringify(changes), false);
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
            })
            .addCase(updateCard.pending, (state, action) => {
                const card = state.data[action.meta.arg.index];
                const { block, fields } = action.meta.arg.changes;
                // logProxy(card[block]);
                for(const title in fields) {
                    card[block][title] = fields[title];
                }
            })
    }
});

export const selectData = (state) => state.list.data;
export const getSelectedCard = (state) => state.list.selectedCard;

export const { selectCard, selectCardByNumber } = listSlice.actions;

export default listSlice.reducer;