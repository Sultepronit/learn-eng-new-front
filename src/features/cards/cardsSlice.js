import { createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import logProxy from "../../dev-helpers/logProxy";
import { fetchCards, updateCard, saveNewCard, deleteCard, restoreCards } from "./cardsThunks";
import { setBackup } from "../../services/cardsBackup";
// import { initIndexedDb } from "./indexedDbHandler";

const cardsAdapter = createEntityAdapter();
const initialState = cardsAdapter.getInitialState({
    dbVersion: {
        articles: 145,
        tap: 12,
        write: 14
    }
});

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
    console.log(action.payload);
    if(!action.payload.dbVersion) return;

    // logProxy(state);
    let data = action.payload.data;

    if(action.payload.totalUpdate) {
        const lastCard = data[data.length - 1];
        data = [...data, createNewCard(lastCard)];
        cardsAdapter.setAll(state, data);
    } else {
        cardsAdapter.upsertMany(state, data);
    }

    const dbVersion = { ...state.dbVersion, ...action.payload.dbVersion };
    console.log(dbVersion);
    state.dbVersion = dbVersion;

    setBackup(data);

    // localStorage.setItem('dbVersions', JSON.stringify(dbVersions));
};

const cardsSlice = createSlice({
    name: 'cards',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(restoreCards.fulfilled, (state, action) => {
                console.timeLog('t', 'use restored');
                // console.log(action.payload);
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

export const selectDbVersion = (state) => state.cards.dbVersion;

export const {
    selectAll: selectAllCards,
    // selectIds: selectCardIds,
    selectById: selectCardById,
    // selectTotal: selectCardsTotal
} = cardsAdapter.getSelectors(state => state.cards);


export default cardsSlice.reducer;
