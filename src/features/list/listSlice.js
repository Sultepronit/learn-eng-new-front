import { createSelector, createSlice } from "@reduxjs/toolkit";
import logProxy from "../../dev-helpers/logProxy";
import { selectAllCards } from "../cards/cardsSlice";
import { fetchCards } from "../cards/cardsThunks";

const initialState = {
    selectedCardId: 0,
    selectedCardNumber: 0,
    reverse: true
};

const listSlice = createSlice({
    name: 'list',
    initialState,
    reducers: {
        setSelectedCardId: (state, action) => {
            state.selectedCardId = action.payload;
        },
        toggleReverse: (state) => {
            state.reverse = !state.reverse;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCards.fulfilled, (state, action) => {
                const lastCard = action.payload[action.payload.length - 1];
                state.selectedCardId = lastCard.id + 1;
            });
    }
});

export const getSelectedCardId = (state) => state.list.selectedCardId;
export const getRerverseValue = (state) => state.list.reverse;

export const {
    setSelectedCardId,
    toggleReverse
} = listSlice.actions;

const selectCardIdByNumber = createSelector(
    [selectAllCards, (state, cardNumber) => cardNumber],
    (cards, cardNumber) => cards.find(card => card.number === cardNumber)?.id
);

// thunk, is what this thing called
export const setSelectedCardIdByNumber = (cardNumber) => (dispatch, getState) => {
    const id = selectCardIdByNumber(getState(), cardNumber);
    if(id) dispatch(setSelectedCardId(id));
}

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