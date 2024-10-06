import { createAsyncThunk } from "@reduxjs/toolkit";
import fetchWithFeatures from "../../services/fetchWithFeatures";
import { restoreCards } from "../../services/cardsBackup";
import { directions, stages } from "./statuses";
import { restoreSession, backupSession, bakcupStages } from "./sessionBackup";

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

        const updatedCards = [];
        for (let i = 1; i < storedCards.length; i++) {
            updatedCards.push({ ...storedCards[i], ...data.cards[i] });
        }
        data.cards = updatedCards;
    }

    if (!data.backup) {
        bakcupStages(data.stages);
        backupSession(data.session);
    }

    // data.cards = data.cards.map(card => ({
    //     ...card,
    //     get repeatStage() {
    //         return card.repeatStatus === 0 ? stages.LEARN
    //             : card.repeatStatus === 1 ? stages.CONFIRM : stages.REPEAT;
    //     },
    //     get direction() {
    //         return card.tapFProgress > card.tapBProgress
    //             ? directions.BACKWARD : directions.FORWARD;
    //     }
    // }));

    console.log(data);

    console.timeLog('t', 'prepared session');

    return data;
});