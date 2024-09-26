import { createSelector, createSlice } from "@reduxjs/toolkit";
import logProxy from "../../dev-helpers/logProxy";
import { selectAllCards } from "../cards/cardsSlice";
import { fetchCards, restoreCards } from "../cards/cardsThunks";

const initialState = {
    rowNumber: 22,
    firstRow: 0,
    returnFirstRow: 0,
    selectedCardNumber: 1,
    findMatchesQuery: '',
    searchQuery: '',
    reverse: true
};

const listSlice = createSlice({
    name: 'list',
    initialState,
    reducers: {
        setFirstRow: (state, action) => {
            // console.log(action.payload);
            state.firstRow = action.payload;
        },
        setSelectedCardNumber: (state, action) => {
            state.selectedCardNumber = action.payload;
        },
        findMatches: (state, action) => {
            state.findMatchesQuery = action.payload;
            if (action.payload !== '') {
                state.returnFirstRow = state.firstRow;
                state.firstRow = 0;
            } else {
                state.firstRow = state.returnFirstRow;
            }
        },
        search: (state, action) => {
            state.searchQuery = action.payload;
            console.log('search:', state.searchQuery);
            state.firstRow = 0;
        },
        toggleReverse: (state) => {
            console.log('toggle!');
            state.reverse = !state.reverse;
            state.firstRow = 0;
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
                    state.selectedCardNumber = action.payload.data.length + 1;
                }
            });
    }
});

export const {
    setFirstRow,
    setSelectedCardNumber,
    findMatches,
    search,
    toggleReverse
} = listSlice.actions;

export const selectRowNumber = (state) => state.list.rowNumber;
export const selectFirstRow = (state) => state.list.firstRow;
export const getSelectedCardNumber = (state) => state.list.selectedCardNumber;
export const selectSeqrchQuery = (state) => state.list.searchQuery;
export const selectRerverseValue = (state) => state.list.reverse;

export const selectPreparedList = createSelector(
    [
        selectAllCards,
        (state) => state.list.findMatchesQuery,
        (state) => state.list.searchQuery,
        (state) => state.list.reverse
    ],
    (list, findMatchesQuery, searchQuery, reverse) => {
        if (findMatchesQuery) {
            list = list.filter(card => card.word.includes(findMatchesQuery));
        } else if (searchQuery) {
            list = list.filter(card => {
                return (card.word + card.translation + card.example).includes(searchQuery);
            });
        }
        
        const cardNumbers = list.map(card => card.number);

        if (reverse) cardNumbers.reverse();

        return cardNumbers;
    }
);

export const selectDisplayedList = createSelector(
    [
        selectPreparedList,
        (state) => state.list.rowNumber,
        (state) => state.list.firstRow,
    ],
    (preparedList, rowNumber, firstRow) => {
        const result = preparedList.slice(firstRow, firstRow + rowNumber);
        // console.log(result);
        return result;
    }
)

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