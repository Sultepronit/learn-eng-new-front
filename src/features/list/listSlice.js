import { createSelector, createSlice } from "@reduxjs/toolkit";
import logProxy from "../../dev-helpers/logProxy";
import { selectAllCards } from "../cards/cardsSlice";
import { fetchCards, restoreCards } from "../cards/cardsThunks";

const initialState = {
    // selectedCardId: 0,
    selectedCard: {},
    reverse: true
};

const listSlice = createSlice({
    name: 'list',
    initialState,
    reducers: {
        setSelectedCard: (state, action) => {
            state.selectedCard = action.payload;
            console.log(action.payload);
        },
        toggleReverse: (state) => {
            state.reverse = !state.reverse;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(restoreCards.fulfilled, (state, action) => {
                if(action.payload.length) {
                    // console.log(action.payload);
                    // console.log(action.payload[action.payload.length - 1]);
                    state.selectedCard = action.payload[action.payload.length - 1];
                }
            })
            .addCase(fetchCards.fulfilled, (state, action) => {
                if(action.payload.totalUpdate) {
                    const data = action.payload.data;
                    state.selectedCard = data[data.length - 1];
                }
            });
    }
});

export const getSelectedCard = (state) => state.list.selectedCard;
export const getSelectedCardId = (state) => state.list.selectedCard.id;
export const getRerverseValue = (state) => state.list.reverse;

export const {
    setSelectedCard,
    // setSelectedCardId,
    toggleReverse
} = listSlice.actions;

// const selectCardByNumber = createSelector(
//     [selectAllCards, (state, cardNumber) => cardNumber],
//     (cards, cardNumber) => cards.find(card => card.number === cardNumber)
// );

// // thunk, is what this thing called
// export const setSelectedCardByNumber = (cardNumber) => (dispatch, getState) => {
//     const card = selectCardByNumber(getState(), cardNumber);
//     dispatch(setSelectedCard(card));
// }

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