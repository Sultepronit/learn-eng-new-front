import { createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import logProxy from "../../dev-helpers/logProxy";
import { fetchCards, updateCard, saveNewCard, deleteCard } from "./cardsThunks";
import checkIntLimits from "../../helpers/chekIntLimits";

const cardsAdapter = createEntityAdapter();
const initialState = cardsAdapter.getInitialState();

function createNewCard(lastCard) {
    return {
        id: lastCard.id + 1,
        number: lastCard.number + 1,
        isNew: true,
        word: '',
        transcription: '',
        translation: '',
        example: ''
    }
}

const updateData = (state, action) => {
    const lastCard = action.payload[action.payload.length - 1];
    const list = [
        ...action.payload,
        createNewCard(lastCard)
    ];
    cardsAdapter.setAll(state, list);
};

const cardsSlice = createSlice({
    name: 'cards',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCards.fulfilled, updateData)
            .addCase(updateCard.pending, (state, action) => {
                cardsAdapter.updateOne(state, action.meta.arg);
            })
            .addCase(saveNewCard.pending, (state, action) => {
                cardsAdapter.updateOne(state, action.meta.arg);
                cardsAdapter.addOne(state, createNewCard(state.entities[action.meta.arg.id]));
            })
            .addCase(deleteCard.fulfilled, updateData);
    }
});

export const {
    selectAll: selectAllCards,
    // selectIds: selectCardIds,
    selectById: selectCardById,
    // selectTotal: selectCardsTotal
} = cardsAdapter.getSelectors(state => state.cards);


export default cardsSlice.reducer;
