import { createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import logProxy from "../../dev-helpers/logProxy";
import checkIntLimits from "../../helpers/chekIntLimits";
import { fetchCards, updateCard, saveNewCard, deleteCard } from "../cards/cardsThunks";

const cardsAdapter = createEntityAdapter();

const initialState = cardsAdapter.getInitialState({
    selectedCardId: 1,
    reverse: true
});

function createNewCard(lastCard) {
    return {
        number: lastCard.number + 1,
        id: lastCard.id + 1,
        isNew: true,
        word: '',
        transcription: '',
        translation: '',
        example: ''
    }
}

const setNewList = (state, action) => {
    const lastCard = action.payload[action.payload.length - 1];
    const list = [
        ...action.payload,
        createNewCard(lastCard)
    ];
    cardsAdapter.setAll(state, list);
    state.selectedCardId = lastCard.id + 1;
};

const listSlice = createSlice({
    name: 'list',
    initialState,
    reducers: {
        setSelectedCardId: (state, action) => {
            state.selectedCardId = checkIntLimits(action.payload, 1, state.ids.length);
        },
        toggleReverse: (state) => {
            state.reverse = !state.reverse;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCards.fulfilled, setNewList)
            .addCase(updateCard.pending, (state, action) => {
                cardsAdapter.updateOne(state, action.meta.arg);
            })
            .addCase(saveNewCard.pending, (state, action) => {
                cardsAdapter.updateOne(state, action.meta.arg);
                cardsAdapter.addOne(state, createNewCard(state.entities[action.meta.arg.id]));
            })
            .addCase(deleteCard.fulfilled, setNewList)
    }
});

export const {
    selectAll: selectAllCards,
    selectIds: selectCardIds,
    selectById: selectCardById
} = cardsAdapter.getSelectors(state => state.list);

export const getSelectedCardId = (state) => state.list.selectedCardId;
export const getRerverseValue = (state) => state.list.reverse;

export const {
    setSelectedCardId,
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