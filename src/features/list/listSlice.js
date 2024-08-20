import { createAsyncThunk, createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import fetchWithFeatures from "../../services/fetchWithFeatures";
import logProxy from "../../dev-helpers/logProxy";
import updateWithQueue from "../../services/updateQueue";

const cardsAdapter = createEntityAdapter();

const initialState = cardsAdapter.getInitialState({
    selectedCardId: 1,
    reverse: true
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
        setSelectedCardId: (state, action) => {
            const inputId = Math.round(action.payload);
            const lastId = state.ids.length;
            const id = (inputId < 1) ? 1 : (inputId > lastId) ? lastId : inputId;
            state.selectedCardId = id;
        },
        toggleReverse: (state) => {
            state.reverse = !state.reverse;
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

export const {
    selectAll: selectAllCards,
    selectIds: selectCardIds,
    selectById: selectCardById
} = cardsAdapter.getSelectors(state => state.list);

export const getSelectedCardId = (state) => state.list.selectedCardId;
export const getRerverseValue = (state) => state.list.reverse;

export const { setSelectedCardId, toggleReverse } = listSlice.actions;

export const selectPreparedList = createSelector(
    [selectAllCards, (state) => state.list.reverse],
    (list, reverse) => {
        const ids = list.map(card => card.id);

        if(reverse) ids.reverse();

        return ids;
    }
);

export default listSlice.reducer;

// by the copilot:
// export const selectSortedAndFilteredIds = createSelector(
// [
//     selectAllCards, // All cards from the state
//     (state) => state.list.sortCriteria, // Sort criteria from the state
//     (state) => state.list.filterCriteria, // Filter criteria from the state
//     (state) => state.list.reverse, // Reverse flag from the state
// ],
// (cards, sortCriteria, filterCriteria, reverse) => {