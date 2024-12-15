import { createAsyncThunk } from "@reduxjs/toolkit";
import fetchWithFeatures from "../../services/fetchWithFeatures";
import { backupCard, restoreCards, setBackup } from "../../services/cardsBackup";
import { restoreSession, bakcupStages } from "./sessionBackup";
import { selectCardByNumber, updateCardState, updateProgress } from "./tapSlice";
import updateWithQueue from "../../services/updateQueue";
import { updateVersion } from "../../services/versionHandlers";

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

export const getSession = createAsyncThunk('tap/getSession', async (dbVersion) => {
    const data = restoreSession() || await fetchSession(dbVersion);

    if (data.session) {
        data.cards = await restoreCards(data.session);
    } else {
        data.session = data.cards.map(card => card.number);

        const storedCards = await restoreCards(data.session);
        console.log(storedCards);

        // const updatedCards = [];
        // for (let i = 0; i < storedCards.length; i++) {
        //     updatedCards.push({ ...storedCards[i], ...data.cards[i] });
        // }
        // data.cards = updatedCards;
        
        data.cards = storedCards.map((storedCard, index) => ({ ...storedCard, ...data.cards[index]}));

        setBackup(data.cards);
    }

    if (!data.backup) bakcupStages(data.stages);

    console.log(data);

    console.timeLog('t', 'prepared session');

    return data;
});

export const updateCard = createAsyncThunk(
    'tap/updateCard',
    async ({ number, dbid, changes, retry }, { dispatch, getState }) => {
        const { cardChanges, progressChanges } = changes;
        console.log(changes);
        if (!Object.keys(cardChanges).length) return; // is it actual?..

        dispatch(updateProgress(progressChanges));

        console.log('saving:', number, cardChanges);

        // update sate
        if (retry) {
            dispatch(updateCardState({ id: number, cardChanges }));
        }
        
        // update db
        const fetchPromise = updateWithQueue(`/cards/${dbid}`, cardChanges);

        // backup
        const updatable = false; // add actual value!!!

        if (updatable) {
            const [backupResult, fetchResult] = await Promise.all([
                backupCard(selectCardByNumber(getState(), number)),
                fetchPromise
            ]);
    
            if (fetchResult?.version && backupResult === 'success') {
                updateVersion(fetchResult.version);
            }
        } else if (retry) {
            await backupCard(selectCardByNumber(getState(), number));
        }
        
        await fetchPromise;
        console.log('saved:', number);
    }
);