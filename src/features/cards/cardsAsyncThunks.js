import { createAsyncThunk } from "@reduxjs/toolkit";
import fetchWithFeatures from "../../services/fetchWithFeatures";
import updateWithQueue from "../../services/updateQueue";
// import { getCardsList, setCardsList } from "./indexedDbHandler";
import { backupCard, restoreBackup, setBackup } from "../../services/cardsBackup";
import { selectAllCards, selectCardByNumber, updateAllCardsState, updateCardState } from "./cardsSlice";
import { getVersion, updateVersion } from "../../services/versionHandlers";

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

async function fetchCards() {
    let path = '/cards';

    const version = getVersion();
    if (version) {
        const { articles, tap, write } = version;
        path += `?articles=${articles}&tap=${tap}&write=${write}`;
    }

    return await fetchWithFeatures(path);
}

export const updateLocalCards = createAsyncThunk(
    'cards/updateLocalCards',
    async (_, { dispatch, getState }) => {
        console.timeLog('t', 'start fetching remote');
        const update = await fetchCards();
        console.timeLog('t', 'end fetching remote');
        console.log('update:', update);

        if(!update.version) return;

        dispatch(updateAllCardsState(update));

        const backupResult = await setBackup(
            selectAllCards(getState())
        );

        if (backupResult === 'success') {
            updateVersion(update.version);
        } else {
            alert(backupResult);
        }
    }
);

export const restoreAndRefreshCards = createAsyncThunk(
    'cards/restoreCards',
    async () => {
        console.timeLog('t', 'start restore');
        // return await restoreBackup();
        const cards = await restoreBackup();
        console.timeLog('t', 'end restore');
        return cards;
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

        if (backupResult === 'success') {
            if (fetchResult?.version) updateVersion(fetchResult.version);
        } else {
            alert(backupResult);
        }
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
        console.log('new card\'s number', cardNumber);
        
        // We are sending just card number to create new card on the server.
        const result = await fetchWithFeatures('/cards', 'POST', { cardNumber });
        // The result should contain dbid of the new card (and new db version).
        // But in case of fail, we are turning card's status back to "empty" one.
        if(!result?.dbid) {
            return { dbid: -1 };
        } else {
            console.log('new card\'s dbid', result.dbid);
        }

        // Now, we can get the local card with all its changes that couldn't be updated without dbid.
        const localCard = selectCardByNumber(getState(), cardNumber);
        const unsavedChanges = filterChanges(localCard);
        console.log('unsaved changes', unsavedChanges);

        // The dbid would be set to the card inside the cardSlice just in a moment.
        // That should allow all the next updates to be normally implemented.

        // All the changes made till now, would be saved with next lines,
        // and we'll wait for a little more time, for not to miss some.
        setTimeout(() => {
            dispatch(updateCard({
                id: cardNumber,
                dbid: result.dbid,
                changes: unsavedChanges
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