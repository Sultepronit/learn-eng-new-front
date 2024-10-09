import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import logProxy from "../../dev-helpers/logProxy";
import { saveNewCard, deleteCard } from "./cardsAsyncThunks";
import { bakcupOneCard, setBackup } from "../../services/cardsBackup";
import createNewCard from "./createNewCard";

const cardsAdapter = createEntityAdapter({
    selectId: (card) => card.number
});

const initialState = cardsAdapter.getInitialState({});

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

    // updateVersionState(state, action.payload.version);

    const toUpdate = Object.values(state.entities);
    setBackup(toUpdate, state.dbVersion);
};

const cardsSlice = createSlice({
    name: 'cards',
    initialState,
    reducers: {
        setAllCards: cardsAdapter.setAll,
        upsertManyCards: cardsAdapter.upsertMany,
        updateCardState: cardsAdapter.updateOne,
        addOneCard: cardsAdapter.addOne,

        updateViewOnly: (state, action) => {
            cardsAdapter.updateOne(state, action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            // .addCase(saveNewCard.pending, (state, action) => {
            //     cardsAdapter.updateOne(state, action.meta.arg);

            //     const nextNewCard = createNewCard(state.entities[action.meta.arg.id]);
            //     cardsAdapter.addOne(state, nextNewCard);
            // })
            // .addCase(saveNewCard.fulfilled, (state, action) => {
            //     const { id: cardNumber } = action.meta.arg;
            //     const changes = { dbid: action.payload.dbid };

            //     cardsAdapter.updateOne(state, { id: cardNumber, changes });

            //     if (changes.dbid === -1) return; // Saving failed, simply

            //     // updateVersionState(state, action.payload.version);
            //     bakcupOneCard(cardNumber, changes, state.dbVersion);
            // })
            .addCase(deleteCard.fulfilled, updateData);
    }
});

export const {
    setAllCards,
    upsertManyCards,
    updateCardState,
    addOneCard,
    updateViewOnly
} = cardsSlice.actions;

export const selectDbVersion = (state) => state.cards.dbVersion;

export const {
    selectAll: selectAllCards,
    // selectIds: selectCardIds,
    selectById: selectCardByNumber,
    selectTotal: selectCardsTotal
} = cardsAdapter.getSelectors(state => state.cards);

export default cardsSlice.reducer;
