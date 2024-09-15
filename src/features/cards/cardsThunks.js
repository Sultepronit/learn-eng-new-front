import { createAsyncThunk } from "@reduxjs/toolkit";
import fetchWithFeatures from "../../services/fetchWithFeatures";
import updateWithQueue from "../../services/updateQueue";
import { getCardsList, setCardsList } from "./indexedDbHandler";

export const fetchCards = createAsyncThunk('cards/fetchData', async () => {
    console.timeLog('idb');
    // return await fetchWithFeatures('/words');
    const localList = await getCardsList();
    console.log(localList);
    console.timeLog('idb', 'received the local list');
    if(localList?.length) return localList;
    
    console.log('Fetching remote list...');

    const list = await fetchWithFeatures('/words');

    // console.time('idb');
    console.timeLog('idb');
    setCardsList(list);
    console.timeLog('idb', 'set data?');
    // console.timeEnd('idb');
    return list;
});

export const updateCard = createAsyncThunk(
    'list/updateCard',
    async ({ id, changes }) => {
        console.log('Saving...', JSON.stringify(changes));
        return await updateWithQueue(`/words/${id}`, changes);
    }
);

export const saveNewCard = createAsyncThunk(
    'cards/saveNewCard',
    async ({ id, changes }) => {
        console.log('new card ', id);
        return await updateWithQueue('/words', changes, 'POST');
    }
);

export const deleteCard = createAsyncThunk(
    'cards/deleteCard',
    async (id) => {
        console.log('deleting card', id);
        return await fetchWithFeatures(`/words/${id}`, 'DELETE', null, false);
    }
);