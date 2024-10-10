import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import logProxy from "../../dev-helpers/logProxy";

const cardsAdapter = createEntityAdapter({
    selectId: (card) => card.number
});

const initialState = cardsAdapter.getInitialState({});

const cardsSlice = createSlice({
    name: 'cards',
    initialState,
    reducers: {
        setAllCards: cardsAdapter.setAll,
        upsertManyCards: cardsAdapter.upsertMany,
        updateCardState: cardsAdapter.updateOne,
        addOneCard: cardsAdapter.addOne,
    }
});

export const {
    setAllCards,
    upsertManyCards,
    updateCardState,
    addOneCard,
} = cardsSlice.actions;

export const {
    selectAll: selectAllCards,
    selectById: selectCardByNumber,
    selectTotal: selectCardsTotal
} = cardsAdapter.getSelectors(state => state.cards);

export default cardsSlice.reducer;