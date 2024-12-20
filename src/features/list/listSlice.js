import { createSelector, createSlice } from "@reduxjs/toolkit";
import logProxy from "../../dev-helpers/logProxy";
import { selectAllCards } from "../cards/cardsSlice";

const initialState = {
    rowNumber: 22,
    firstRow: 0,
    backupFirstRow: 0,
    selectedCardNumber: 1,
    findMatchesQuery: '',
    searchQuery: '',
    reverse: true,
    sortColumn: ''
};

const listSlice = createSlice({
    name: 'list',
    initialState,
    reducers: {
        setFirstRow: (state, action) => {
            state.firstRow = action.payload;
        },
        setSelectedCardNumber: (state, action) => {
            state.selectedCardNumber = action.payload;
        },
        findMatches: (state, action) => {
            state.findMatchesQuery = action.payload;
            if (action.payload !== '') {
                state.backupFirstRow = state.firstRow;
                state.firstRow = 0;
            } else {
                state.firstRow = state.backupFirstRow;
            }
        },
        search: (state, action) => {
            state.searchQuery = action.payload;
            console.log('search:', state.searchQuery);
            state.firstRow = 0;
        },
        toggleReverse: (state) => {
            state.reverse = !state.reverse;
            state.firstRow = 0;
        },
        sort: (state, action) => {
            state.sortColumn = action.payload;
        }
    }
});

export const {
    setFirstRow,
    setSelectedCardNumber,
    findMatches,
    search,
    toggleReverse,
    sort
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
        (state) => state.list.reverse,
        (state) => state.list.sortColumn
    ],
    (list, findMatchesQuery, searchQuery, reverse, sortColumn) => {
        if (findMatchesQuery) {
            list = list.filter(card => card.word.includes(findMatchesQuery));
        } else if (searchQuery) {
            list = list.filter(card => {
                return (String(card.word) + card.translation + card.example).includes(searchQuery);
            });
        }

        if (sortColumn) {
            list.sort((a, b) => a[sortColumn] - b[sortColumn]);
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