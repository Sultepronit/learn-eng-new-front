import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import fetchWithFeatures from "../../services/fetchWithFeatures";
import logProxy from "../../dev-helpers/logProxy";
import updateWithQueue from "../../services/updateQueue";

const cardsAdapter = createEntityAdapter();

const initialState = cardsAdapter.getInitialState({
    // selectedCard: {}
    selectedCardId: 1
});

export const fetchData = createAsyncThunk('data/fetchData', async () => {
    return await fetchWithFeatures('/words');
});

export const updateCard = createAsyncThunk('data/updateCard', async ({ dbId, changes }) => {
    console.log('Saving...', JSON.stringify(changes));
    // return await fetchWithFeatures(`/words/${id}`, 'PATCH', JSON.stringify(changes), false);
    // return await fetchWithFeatures(`/words/${id}`, 'PATCH', JSON.stringify(changes));
    return await updateWithQueue('/words', dbId, changes);
});

const listSlice = createSlice({
    name: 'list',
    // initialState: {
    //     data: [],
    //     selectedCard: emptyCard
    // },
    initialState,
    reducers: {
        // selectCard: (state, action) => {
        //     state.selectedCard = action.payload;
        //     console.log(state.selectedCard);
        // },
        // selectCardByIndex: (state, action) => {
        //     const inputIndex = Math.round(action.payload);
        //     const lastIndex = state.data.length - 1;
        //     const index = inputIndex < 0 ? 0 : inputIndex > lastIndex ? lastIndex : inputIndex;

        //     state.selectedCard = state.data[index];
        // }
        setSelectedCardId: (state, action) => {
            const inputId = Math.round(action.payload);
            const lastId = state.ids.length;
            const id = (inputId < 1) ? 1 : (inputId > lastId) ? lastId : inputId;
            state.selectedCardId = id;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchData.fulfilled, (state, action) => {
                // state.data = action.payload;
                cardsAdapter.upsertMany(state, action.payload);
            })
            .addCase(updateCard.pending, (state, action) => {
                console.log(action.meta.arg);
                const { id, changes } = action.meta.arg;
                cardsAdapter.updateOne(state, { id, changes });
            })
    }
});

// export const selectData = (state) => state.list.data;
export const {
    // selectAll: selectData,
    selectIds: selectCardIds,
    selectById: selectCardById
} = cardsAdapter.getSelectors(state => state.list);

// export const getSelectedCard = (state) => state.list.selectedCard;
export const getSelectedCardId = (state) => state.list.selectedCardId;

// export const { selectCard, selectCardByIndex } = listSlice.actions;
export const { setSelectedCardId } = listSlice.actions;

export default listSlice.reducer;