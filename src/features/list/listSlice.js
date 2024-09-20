import { createSelector, createSlice } from "@reduxjs/toolkit";
import logProxy from "../../dev-helpers/logProxy";
import { selectAllCards } from "../cards/cardsSlice";
import { fetchCards, restoreCards } from "../cards/cardsThunks";

const initialState = {
    selectedCardNumber: 1,
    reverse: true
};

const listSlice = createSlice({
    name: 'list',
    initialState,
    reducers: {
        setSelectedCardNumber: (state, action) => {
            state.selectedCardNumber = action.payload;
        },
        toggleReverse: (state) => {
            state.reverse = !state.reverse;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(restoreCards.fulfilled, (state, action) => {
                if(action.payload.length) {
                    state.selectedCardNumber = action.payload.length;
                }
            })
            .addCase(fetchCards.fulfilled, (state, action) => {
                if(action.payload.totalUpdate) {
                    console.log('about to select new card');
                    state.selectedCardNumber = action.payload.data.length + 1;
                }
            });
    }
});

export const {
    setSelectedCardNumber,
    toggleReverse
} = listSlice.actions;

export const getSelectedCardNumber = (state) => state.list.selectedCardNumber;
export const getRerverseValue = (state) => state.list.reverse;

export const selectPreparedList = createSelector(
    [selectAllCards, (state) => state.list.reverse],
    (list, reverse) => {
        // const ids = list.map(card => card.id);
        const ids = list.map(card => card.number);

        if(reverse) ids.reverse();

        return ids;
    }
);

export default listSlice.reducer;

// export const selectSortedAndFilteredIds = createSelector(
// [
//     selectAllCards, // All cards from the state
//     (state) => state.list.sortCriteria, // Sort criteria from the state
//     (state) => state.list.filterCriteria, // Filter criteria from the state
//     (state) => state.list.reverse, // Reverse flag from the state
// ],
// (cards, sortCriteria, filterCriteria, reverse) => {

// const selectCardByNumber = createSelector(
//     [selectAllCards, (state, cardNumber) => cardNumber],
//     (cards, cardNumber) => cards.find(card => card.number === cardNumber)
// );

// // thunk, is what this thing called
// export const setSelectedCardByNumber = (cardNumber) => (dispatch, getState) => {
//     const card = selectCardByNumber(getState(), cardNumber);
//     dispatch(setSelectedCard(card));
// }