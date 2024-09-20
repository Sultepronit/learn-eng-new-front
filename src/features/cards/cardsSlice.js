import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import logProxy from "../../dev-helpers/logProxy";
import { fetchCards, updateCard, saveNewCard, deleteCard, restoreCards } from "./cardsThunks";
import { bakcupOneCard, setBackup } from "../../services/cardsBackup";
import removeNullFields from "../../helpers/removeNullFields";

const cardsAdapter = createEntityAdapter({
    selectId: (card) => card.number
});

// const dbVersion = JSON.parse(localStorage.getItem('dbVersion')) || {};
const dbVersion = JSON.parse(localStorage.getItem('dbVersion'));
console.log('saved version:', dbVersion);

const initialState = cardsAdapter.getInitialState({
    dbVersion
});

function createNewCard(lastCard) {
    return {
        dbid: -1,
        number: lastCard.number + 1,
        word: '',
        transcription: '',
        translation: '',
        example: ''
    }
}

function updateVersionState(state, change) {
    const dbVersion = { ...state.dbVersion, ...change };
    state.dbVersion = dbVersion;
    console.log('new version:', dbVersion);
}

const updateData = (state, action) => {
    console.log('data:', action.payload);
    if(!action.payload.version) return;

    // logProxy(state);
    let data = action.payload.data;

    if(action.payload.totalUpdate) {
        const lastCard = data[data.length - 1];
        data = [...data, createNewCard(lastCard)];
        cardsAdapter.setAll(state, data);
    } else {
        cardsAdapter.upsertMany(state, data);
    }

    // const dbVersion = { ...state.dbVersion, ...action.payload.version };
    // state.dbVersion = dbVersion;
    // console.log('new version:', dbVersion);

    updateVersionState(state, action.payload.version);

    console.log(data);
    setBackup(data, state.dbVersion);
};

const cardsSlice = createSlice({
    name: 'cards',
    initialState,
    reducers: {
        updateViewOnly: (state, action) => {
            cardsAdapter.updateOne(state, action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(restoreCards.fulfilled, (state, action) => {
                if(state.ids.length) {
                    console.log('It seems, that fetching was faster & resotred data is\'t in need');
                    return;
                }
                cardsAdapter.setAll(state, action.payload);
                console.log('resotred:', action.payload);
            })
            .addCase(fetchCards.fulfilled, updateData)
            .addCase(updateCard.pending, (state, action) => {
                cardsAdapter.updateOne(state, action.meta.arg);
            })
            .addCase(updateCard.fulfilled, (state, action) => {
                // console.log(action.payload);
                // console.log(action.meta.arg);
                const { id: cardNumber, changes } = action.meta.arg;

                if(action.payload?.version) {
                    updateVersionState(state, action.payload.version);
                    bakcupOneCard(cardNumber, changes, state.dbVersion);
                } else {
                    bakcupOneCard(cardNumber, changes);
                }
            })
            .addCase(saveNewCard.pending, (state, action) => {
                cardsAdapter.updateOne(state, action.meta.arg);
                cardsAdapter.addOne(state, createNewCard(state.entities[action.meta.arg.id]));
            })
            .addCase(saveNewCard.fulfilled, (state, action) => {
                const update = action.meta.arg;
                // update.changes = action.payload.card;
                update.changes = removeNullFields(action.payload.card); // move to server!
                // console.log(action.meta.arg.id, action.payload);
                console.log(update);
                cardsAdapter.updateOne(state, update);
            })
            .addCase(deleteCard.fulfilled, updateData);
    }
});

export const {
    updateViewOnly
} = cardsSlice.actions;

export const selectDbVersion = (state) => state.cards.dbVersion;

export const {
    selectAll: selectAllCards,
    // selectIds: selectCardIds,
    // selectById: selectCardById,
    selectById: selectCardByNumber,
    selectTotal: selectCardsTotal
} = cardsAdapter.getSelectors(state => state.cards);


export default cardsSlice.reducer;
