import { createAsyncThunk, createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import fetchWithFeatures from "../../services/fetchWithFeatures";
import logProxy from "../../dev-helpers/logProxy";
import updateWithQueue from "../../services/updateQueue";

const cardsAdapter = createEntityAdapter();

const initialState = cardsAdapter.getInitialState({
    displayedRowNumber: 22,
    lastDisplayedId: 0,
    selectedCardId: 1,
    reverse: true
});

export const fetchData = createAsyncThunk('data/fetchData', async () => {
    return await fetchWithFeatures('/words');
});

export const updateCard = createAsyncThunk('data/updateCard', async ({ dbId, changes }) => {
    console.log('Saving...', JSON.stringify(changes));
    return await updateWithQueue('/words', dbId, changes);
});

function checkLimits(value, min, max) {
    value = Math.round(value);
    return (value < min) ? min : (value > max) ? max : value;
}

const listSlice = createSlice({
    name: 'list',
    initialState,
    reducers: {
        setLastDisplayedId: (state, action) => {
            state.lastDisplayedId = checkLimits(
                action.payload,
                state.displayedRowNumber,
                state.ids.length
            );
        },
        setSelectedCardId: (state, action) => {
            state.selectedCardId = checkLimits(action.payload, 1, state.ids.length);
        },
        changeSelectedCardId: (state, action) => {
            state.selectedCardId = checkLimits(state.selectedCardId + action.payload, 1, state.ids.length);
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

export const getDisplayedRowNumber = (state) => state.list.displayedRowNumber;
export const getLastDisplayedId = (state) => state.list.lastDisplayedId;
export const getSelectedCardId = (state) => state.list.selectedCardId;
export const getRerverseValue = (state) => state.list.reverse;

export const {
    setLastDisplayedId,
    setSelectedCardId,
    changeSelectedCardId,
    toggleReverse
} = listSlice.actions;

export const selectPreparedList = createSelector(
    [selectAllCards, (state) => state.list.reverse],
    (list, reverse) => {
        const ids = list.map(card => card.id);

        if(reverse) ids.reverse();

        return ids;
    }
);

export const selectDisplayRange = createSelector(
    [
        selectPreparedList,
        (state) => state.list.lastDisplayedId,
        (state) => state.list.displayedRowNumber
    ],
    (list, lastId, rowNumber) => {
        const result = list.slice(lastId - rowNumber, lastId);
        console.log(result);
        return result;
    }
)

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