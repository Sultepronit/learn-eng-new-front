import { createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import logProxy from "../../dev-helpers/logProxy";
import { fetchCards, updateCard, saveNewCard, deleteCard, restoreCards } from "./cardsThunks";
import { setBackup } from "../../services/cardsBackup";
// import { initIndexedDb } from "./indexedDbHandler";

const cardsAdapter = createEntityAdapter({
    selectId: (card) => card.number
});
const initialState = cardsAdapter.getInitialState({
    dbVersion: {
        articles: 14,
        tap: 12,
        write: 14
    }
});

function createNewCard(lastCard) {
    return {
        // id: lastCard.id + 1,
        number: lastCard.number + 1,
        // newCard: 'local',
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
        console.log('about to set new list');
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
                console.log(action.meta.arg);
                const data = action.meta.arg;
                data.changes.dbid = -1;
                cardsAdapter.updateOne(state, data);
                cardsAdapter.addOne(state, createNewCard(state.entities[action.meta.arg.id]));
            })
            .addCase(saveNewCard.fulfilled, (state, action) => {
                console.log(action.meta.arg);
                console.log(action.payload);
                // console.log(action);
            })
            .addCase(updateCard.fulfilled, (state, action) => {
                console.log(action.meta.arg);
                console.log(action.payload);
                // console.log(action);
            })
            .addCase(deleteCard.fulfilled, updateData);
    }
});

export const selectDbVersion = (state) => state.cards.dbVersion;

export const {
    selectAll: selectAllCards,
    // selectIds: selectCardIds,
    // selectById: selectCardById,
    selectById: selectCardByNumber,
    selectTotal: selectCardsTotal
} = cardsAdapter.getSelectors(state => state.cards);


export default cardsSlice.reducer;
