import { createAsyncThunk } from "@reduxjs/toolkit";
import fetchWithFeatures from "../../services/fetchWithFeatures";
import { backupCard, restoreCards, backupCards } from "../../services/cardsBackup";
import { restoreSession, bakcupSessionConsts, removeSessionBackup } from "./sessionBackup";
import { selectCardByNumber, updateCardState, updateProgress } from "./tapSlice";
import updateWithQueue from "../../services/updateQueue";
import { incrementVersion, updateVersion } from "../../services/versionHandlers";
import { selectImplementingResotredUpdates } from "../status/statusSlice";
import setPause from "../../helpers/setPause";

async function fetchSession(dbVersion) {
    let path = '/tap-session';

    if(dbVersion) {
        const { articles, tap } = dbVersion;
        path += `?articles=${articles}&tap=${tap}`;
        // path += `?tap=${tap}`;
    }

    console.timeLog('t', 'start fetching remote');
    const data = await fetchWithFeatures(path);
    console.timeLog('t', 'end fetching remote');

    return data;
}

export const getSession = createAsyncThunk(
    'tap/getSession',
    async (dbVersion, { _, getState }) => {   
        // const data = restoreSession() || await fetchSession(dbVersion);
        let data = restoreSession();
        // console.log(data);

        if (!data) {
            // const state = getState();
            // const implementingResotredUpdates = selectImplementingResotredUpdates(getState());
            // console.log(implementingResotredUpdates);
            
            for (let i = 0; i < 1000; i++) {
                await setPause(300);
                console.log(i);
                const implementingResotredUpdates = selectImplementingResotredUpdates(getState());
                if (!implementingResotredUpdates) break;
                console.log(implementingResotredUpdates);
            }

            data = await fetchSession(dbVersion);
        }

        if (data.session) {
            // data.session[data.session.length - 1] = 624;
            // data.session[data.session.length - 1] = 382;
            data.cards = await restoreCards(data.session);
            // console.log(data.cards)
            
            // in case of clean-up if IndexedDB
            if (!data.cards[0]) {
                removeSessionBackup();
                location.reload();
            }
        } else {
            data.session = data.cards.map(card => card.number);

            const storedCards = await restoreCards(data.session);
            console.log(storedCards);
            
            data.cards = storedCards.map((storedCard, index) => ({ ...storedCard, ...data.cards[index]}));

            backupCards(data.cards);
        }

        if (!data.backup) data.sessionLength = data.session.length;
        if (!data.backup) bakcupSessionConsts(data);

        console.log(data);

        console.timeLog('t', 'prepared session');

        return data;
    }
);

let upToDate = true;
export const updateCard = createAsyncThunk(
    'tap/updateCard',
    async ({ number, dbid, changes, retry }, { dispatch, getState }) => {
        const { cardChanges, progressChanges } = changes;
        console.log(changes);
        if (!Object.keys(cardChanges).length) return; // is it actual?..

        dispatch(updateProgress(progressChanges));

        console.log('saving:', number, cardChanges);
        
        // update db
        const fetchPromise = updateWithQueue(`/cards/${dbid}`, cardChanges);

        if (upToDate || retry) {
            // update sate
            dispatch(updateCardState({ id: number, changes: cardChanges }));

            // backup
            const backupResult = await backupCard(selectCardByNumber(getState(), number));
            if (backupResult !== 'success') alert('Backup failed!');

            if (upToDate) {
                const fetchResult = await fetchPromise;
    
                if (fetchResult?.version && backupResult === 'success') {
                    // updateVersion(fetchResult.version);
                    if (incrementVersion(fetchResult.version, 1, 'write') !== 'success') upToDate = false;
                }
            }
        }
        
        await fetchPromise;
        console.log('saved:', number);
    }
);