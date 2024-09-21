import { createAsyncThunk } from "@reduxjs/toolkit";
import fetchWithFeatures from "../../services/fetchWithFeatures";
import updateWithQueue from "../../services/updateQueue";
// import { getCardsList, setCardsList } from "./indexedDbHandler";
import { restoreBackup } from "../../services/cardsBackup";
import { selectCardByNumber } from "./cardsSlice";

export const restoreCards = createAsyncThunk(
    'cards/restoreCards',
    async () => {
        console.timeLog('t', 'start restore');
        // return await restoreBackup();
        const cards = await restoreBackup();
        console.timeLog('t', 'end restore');
        return cards;
    }
);

export const fetchCards = createAsyncThunk('cards/fetchCards', async (dbVersion) => {
    let path = '/cards';

    if(dbVersion) {
        const { articles, tap, write } = dbVersion;
        path += `?articles=${articles}&tap=${tap}&write=${write}`;
    }

    console.timeLog('t', 'start fetching remote');
    const list = await fetchWithFeatures(path);
    console.timeLog('t', 'end fetching remote');
    return list;
});

export const updateCard = createAsyncThunk(
    'cards/updateCard',
    async ({ dbid, changes }) => {
        console.log('Saving...', JSON.stringify(changes));
        return await updateWithQueue(`/cards/${dbid}`, changes);
    }
);

function filterChanges(card) {
    let changes = {};
    for(const field in card) {
        if(field === 'dbid' || field === 'number') continue;
        if(!card[field]) continue;
        changes[field] = card[field];
    }
    return changes;
}

export const saveNewCard = createAsyncThunk(
    'cards/saveNewCard',
    async ({ id: cardNumber }, { dispatch, getState }) => {
        console.log('new card ', cardNumber);
        
        // We are sending just card number to create new card on server.
        const result = await fetchWithFeatures('/cards', 'POST', { cardNumber });
        console.log('dbCard', result.card);

        // Now, we can get the local card with all its changes that couldn't be updated without dbid.
        const localCard = selectCardByNumber(getState(), cardNumber);
        console.log('localCard', localCard);

        // The dbid would be set to the card inside the cardSlice just in a moment.
        // That should allow all the next updates to be normally implemented.

        // All the changes made till now, would be saved with next lines,
        // and we'll wait for a little more time, for not to miss some.
        setTimeout(() => {
            dispatch(updateCard({
                id: cardNumber,
                dbid: result.card.dbid,
                changes: filterChanges(localCard)
            }));
        }, 200);

        return result;
    }
);

export const deleteCard = createAsyncThunk(
    'cards/deleteCard',
    async (id) => {
        console.log('deleting card', id);
        return await fetchWithFeatures(`/cards/${id}`, 'DELETE', null, false);
    }
);