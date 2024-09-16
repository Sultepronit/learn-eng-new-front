import { createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import logProxy from "../../dev-helpers/logProxy";
import { fetchCards, updateCard, saveNewCard, deleteCard, restoreCards } from "./cardsThunks";
import { setBackup } from "../../services/cardsBackup";
// import { initIndexedDb } from "./indexedDbHandler";

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
    const data = action.payload.data;
    const lastCard = data[data.length - 1];
    console.log(data);
    console.log(lastCard);
    const list = [
        ...data,
        createNewCard(lastCard)
    ];
    cardsAdapter.setAll(state, list);

    setBackup(list);

    const dbVersions = {
        articles: 145,
        tap: 458,
        write: 1
    };
    localStorage.setItem('dbVersions', JSON.stringify(dbVersions));
};

const cardsSlice = createSlice({
    name: 'cards',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(restoreCards.fulfilled, (state, action) => {
                console.timeLog('t', 'use restored');
                console.log(action.payload);
                cardsAdapter.setAll(state, action.payload);
            })
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
