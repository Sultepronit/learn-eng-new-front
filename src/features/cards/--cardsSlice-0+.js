import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import logProxy from "../../dev-helpers/logProxy";
import { updateCard, saveNewCard, deleteCard, restoreCards } from "./cardsThunks";
import { bakcupOneCard, setBackup } from "../../services/cardsBackup";
import createNewCard from "./createNewCard";

const cardsAdapter = createEntityAdapter({
    selectId: (card) => card.number
});

// const dbVersion = JSON.parse(localStorage.getItem('dbVersion'));
// console.log('saved version:', dbVersion);

const initialState = cardsAdapter.getInitialState({
    // dbVersion
});

// function updateVersionState(state, change) {
//     const dbVersion = { ...state.dbVersion, ...change };
//     state.dbVersion = dbVersion;
//     console.log('new version:', dbVersion);
// }

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
        updateAllCardsState: (state, action) => {       
            // logProxy(state);
            const { data, totalUpdate } = action.payload;
        
            if(totalUpdate) {
                cardsAdapter.setAll(
                    state,
                    [...data, createNewCard(data[data.length - 1])]
                );
            } else {
                cardsAdapter.upsertMany(state, data);
            }
            
            console.log('updated the state!');
        },
        updateCardState: cardsAdapter.updateOne,

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
            // .addCase(fetchCards.fulfilled, updateData)
            // .addCase(updateCard.pending, (state, action) => {
            //     cardsAdapter.updateOne(state, action.meta.arg);
            // })
            .addCase(updateCard.fulfilled, (state, action) => {
                // console.log(action.payload);
                console.log(action.meta.arg);
                const { id: cardNumber, changes } = action.meta.arg;

                if(action.payload?.version) {
                    // updateVersionState(state, action.payload.version);
                    bakcupOneCard(cardNumber, changes, state.dbVersion);
                } else {
                    bakcupOneCard(cardNumber, changes);
                }
            })
            .addCase(saveNewCard.pending, (state, action) => {
                cardsAdapter.updateOne(state, action.meta.arg);

                const nextNewCard = createNewCard(state.entities[action.meta.arg.id]);
                cardsAdapter.addOne(state, nextNewCard);
            })
            .addCase(saveNewCard.fulfilled, (state, action) => {
                const { id: cardNumber } = action.meta.arg;
                const changes = { dbid: action.payload.dbid };

                cardsAdapter.updateOne(state, { id: cardNumber, changes });

                if (changes.dbid === -1) return; // Saving failed, simply

                // updateVersionState(state, action.payload.version);
                bakcupOneCard(cardNumber, changes, state.dbVersion);
            })
            .addCase(deleteCard.fulfilled, updateData);
    }
});

export const {
    updateAllCardsState,,
    updateCardState,
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
