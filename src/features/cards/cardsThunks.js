import { createAsyncThunk } from "@reduxjs/toolkit";
import fetchWithFeatures from "../../services/fetchWithFeatures";
import updateWithQueue from "../../services/updateQueue";
// import { getCardsList, setCardsList } from "./indexedDbHandler";
import { restoreBackup } from "../../services/cardsBackup";

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
    // setCardsList(list);
    console.timeLog('t', 'end fetching remote');
    return list;
});

export const updateCard = createAsyncThunk(
    'cards/updateCard',
    async ({ id, changes }) => {
        console.log('Saving...', JSON.stringify(changes));
        return await updateWithQueue(`/words/${id}`, changes);
    }
);

export const saveNewCard = createAsyncThunk(
    'cards/saveNewCard',
    async ({ id }) => {
        console.log('new card ', id);
        return await updateWithQueue('/cards', id, 'POST');
    }
);

export const deleteCard = createAsyncThunk(
    'cards/deleteCard',
    async (id) => {
        console.log('deleting card', id);
        return await fetchWithFeatures(`/cards/${id}`, 'DELETE', null, false);
    }
);