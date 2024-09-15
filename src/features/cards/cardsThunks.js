import { createAsyncThunk } from "@reduxjs/toolkit";
import fetchWithFeatures from "../../services/fetchWithFeatures";
import updateWithQueue from "../../services/updateQueue";

export const fetchCards = createAsyncThunk('cards/fetchData', async () => {
    return await fetchWithFeatures('/words');
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