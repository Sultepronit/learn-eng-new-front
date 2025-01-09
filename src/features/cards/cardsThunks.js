import { createAsyncThunk } from "@reduxjs/toolkit";
import fetchWithFeatures from "../../services/fetchWithFeatures";
import updateWithQueue from "../../services/updateQueue";
import { backupCard, restoreAllCards, backupCards } from "../../services/cardsBackup";
import { addOneCard, selectAllCards, selectCardByNumber, setAllCards, updateCardState, upsertManyCards } from "./cardsSlice";
import { getVersion, incrementVersion, updateVersion } from "../../services/versionHandlers";
import createNewCard from "./createNewCard";
import { setSelectedCardNumber } from "../list/listSlice";

async function fetchCards() {
    let path = '/cards';

    const version = getVersion();
    if (version) {
        const { articles, tap, write } = version;
        path += `?articles=${articles}&tap=${tap}&write=${write}`;
    }

    return await fetchWithFeatures(path);
}

const updateCardsLocally = (update) => async (dispatch, getState) => {
    console.log('refreshing cards....');
    if(!update.version) return;

    const { data, totalUpdate } = update;

    if(totalUpdate) {
        const dataPlus = [...data, createNewCard(data.length)];
        dispatch(setAllCards(dataPlus));
    } else {
        dispatch(upsertManyCards(data));
    }

    dispatch(setSelectedCardNumber(data.length)); // selecting last* card

    const backupResult = await backupCards(selectAllCards(getState()));

    if (backupResult === 'success') {
        updateVersion(update.version);
    } else {
        alert(backupResult);
    }
}

export const restoreAndRefreshCards = createAsyncThunk(
    'cards/restoreAndRefreshCards',
    async (_, { dispatch }) => {
        console.timeLog('t', 'start restore & refresh');

        const restorePromise = restoreAllCards();
        const fetchPromise = fetchCards();
        
        const firstResult = await Promise.any([restorePromise, fetchPromise]);

        let update = null;
        if (Array.isArray(firstResult)) { // backup is first
            const restored = firstResult;
            console.timeLog('t', 'restored:');
            console.log(restored);
            
            dispatch(setAllCards(restored));
            dispatch(setSelectedCardNumber(restored.length)); // selecting last card

            update = await fetchPromise;
            console.timeLog('t', 'fetched remote:');
            console.log(update);
        } else { // fetch is first
            console.timeLog('t', 'fetched remote first!');
            console.log(firstResult);

            update = firstResult;
            
            if (!update.totalUpdate) {
                const restoredData = await restorePromise;
                dispatch(setAllCards(restoredData));
                dispatch(setSelectedCardNumber(restoredData.length)); // selecting last card

                console.timeLog('t', 'just now restored:');
                console.log(restoredData);
            }
        }

        await dispatch(updateCardsLocally(update));

        console.timeLog('t', 'refreshed the data!');
    } 
);

export const refreshCards = createAsyncThunk(
    'cards/refreshCards',
    async (_, { dispatch }) => {
        const update = await fetchCards();
        console.log('update:', update);

        await dispatch(updateCardsLocally(update));
    }
);


export const updateCard = createAsyncThunk(
    'cards/updateCard',
    async ({ number, dbid, changes }, { dispatch, getState }) => {
        console.log('Saving...', changes);

        dispatch(updateCardState({ id: number, changes }));

        const [backupResult, fetchResult] = await Promise.all([
            backupCard(selectCardByNumber(getState(), number)),
            updateWithQueue(`/cards/${dbid}`, changes)
        ]);

        if (backupResult === 'success' && fetchResult?.version) {
            if (incrementVersion(fetchResult.version) !== 'success') dispatch(refreshCards());
        }
    }
);

async function backupNewCard(card, version, dispatch) {
    const result = await backupCard(card);
    // if (result === 'success') updateVersion(version);
    if (result === 'success') {
        if (incrementVersion(version, 3) !== 'success') dispatch(refreshCards());
    }
}

function filterChanges(card) {
    let changes = {};
    for(const field in card) {
        if (field === 'dbid' || field === 'number' || field === 'repeatStatus') continue;
        if (!card[field]) continue;
        changes[field] = card[field];
    }
    return changes;
}

export const saveNewCard = createAsyncThunk(
    'cards/saveNewCard',
    async ({ number, changes }, { dispatch, getState }) => {
        console.log('new card\'s number', number);

        dispatch(updateCardState({ id: number, changes }));

        // adding next new card to the state & bakcup
        const nextNewCard = createNewCard(number);
        dispatch(addOneCard(nextNewCard));
        backupCard(nextNewCard);
        
        // try and create new card on the server
        const result = await fetchWithFeatures('/cards', 'POST', { cardNumber: number });
        
        if(!result?.dbid) {
            console.warn('card was not created:', result);
            dispatch(updateCardState({ id: number, changes: { dbid: -1 } }));
            return;
        }

        // now that we get the dbid & version we are saving them to the state & backup
        const { dbid, version } = result;
        console.log('new card\'s dbid', dbid);

        dispatch(updateCardState({ id: number, changes: { dbid } }));
        backupNewCard(selectCardByNumber(getState(), number), version, dispatch);

        // Now, we can get the local card with all its changes
        // that couldn't be updated without dbid, and do update!
        const localCard = selectCardByNumber(getState(), number);
        const unsavedChanges = filterChanges(localCard);
        console.log('unsaved changes', unsavedChanges);

        dispatch(updateCard({ number, dbid, changes: unsavedChanges }));
    }
);

export const deleteCard = createAsyncThunk(
    'cards/deleteCard',
    async (id, { dispatch }) => {
        console.log('deleting card', id);

        const newList = await fetchWithFeatures(`/cards/${id}`, 'DELETE', null, false);
        console.log('new list:', newList)

        await dispatch(updateCardsLocally(newList));
    }
);