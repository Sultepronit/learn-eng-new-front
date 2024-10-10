import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import logProxy from "../../dev-helpers/logProxy";
import { deleteCard } from "./cardsAsyncThunks";
import { setBackup } from "../../services/cardsBackup";
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
    },
    extraReducers: (builder) => {
        builder
            .addCase(deleteCard.fulfilled, updateData);
    }
});

export const {
    setAllCards,
    upsertManyCards,
    updateCardState,
    addOneCard,
} = cardsSlice.actions;

export const selectDbVersion = (state) => state.cards.dbVersion;

export const {
    selectAll: selectAllCards,
    // selectIds: selectCardIds,
    selectById: selectCardByNumber,
    selectTotal: selectCardsTotal
} = cardsAdapter.getSelectors(state => state.cards);

export default cardsSlice.reducer;
