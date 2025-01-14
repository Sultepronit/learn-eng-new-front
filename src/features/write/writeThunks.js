import { createAsyncThunk } from "@reduxjs/toolkit";
import fetchWithFeatures from "../../services/fetchWithFeatures";
import { getVersion, incrementVersion } from "../../services/versionHandlers";
import { backupCard, restoreCards } from "../../services/cardsBackup";
import { selectCardByNumber, updateCardState, updateProgress } from "./writeSlice";
import updateWithQueue from "../../services/updateQueue";

// async function fetchSession() {
//     console.timeLog('t', 'start fetching remote');
//     const data = await fetchWithFeatures('/write-session');
//     console.timeLog('t', 'end fetching remote');

//     return data;
// }

async function fetchSession() {
    let path = '/write-session';

    const dbVersion = getVersion();
    if(dbVersion) {
        const { articles, write } = dbVersion;
        path += `?articles=${articles}&write=${write}`;
    }

    console.timeLog('t', 'start fetching remote');
    const data = await fetchWithFeatures(path);
    console.timeLog('t', 'end fetching remote');

    return data;
}

export const getSession = createAsyncThunk('write/getSession', async () => {  
    const data = await fetchSession();

    if (data.session) {
        // data.session.length = 10;
        // data.session[data.session.length - 1] = 624;
        // data.session[data.session.length - 1] = 382;
        data.cards = await restoreCards(data.session);
    } else {
        // data.cards.length = 10;
        data.session = data.cards.map(card => card.number);

        const storedCards = await restoreCards(data.session);
        console.log(storedCards);
        
        data.cards = storedCards.map((storedCard, index) => ({ ...storedCard, ...data.cards[index]}));

        // setBackup(data.cards);
    }

    // if (!data.backup) data.sessionLength = data.session.length;

    // if (!data.backup) bakcupSessionConsts(data, updatable);
    data.sessionLength = data.cards.length;
    
    console.log(data);

    // console.timeLog('t', 'prepared session');

    return data;
});

let upToDate = true;
export const updateCard = createAsyncThunk(
    'write/updateCard',
    async ({ number, dbid, changes, retry }, { dispatch, getState }) => {
        const { cardChanges, progressUpdates } = changes;
        if (!Object.keys(cardChanges).length) return; // is it actual?..

        dispatch(updateProgress(progressUpdates));

        console.log('saving:', number, cardChanges);
        
        // update db
        const fetchPromise = updateWithQueue(`/cards/${dbid}`, cardChanges);
        // const fetchPromise = null;

        if (upToDate || retry) {
            // update sate
            dispatch(updateCardState({ id: number, changes: cardChanges }));

            // backup
            const backupResult = await backupCard(selectCardByNumber(getState(), number));
            if (backupResult !== 'success') alert('Backup failed!');

            if (upToDate) {
                const fetchResult = await fetchPromise;
    
                if (fetchResult?.version && backupResult === 'success') {
                    if (incrementVersion(fetchResult.version, 1, 'tap') !== 'success') upToDate = false;
                }
            }
        }
        
        await fetchPromise;
        console.log('saved:', number);
    }
);