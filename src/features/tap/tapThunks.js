import { createAsyncThunk } from "@reduxjs/toolkit";
import fetchWithFeatures from "../../services/fetchWithFeatures";
import { restoreCards } from "../../services/cardsBackup";

export const getSession = createAsyncThunk('tap/getSession', async (dbVersion) => {
    let path = '/tap-session';

    if(dbVersion) {
        const { articles, tap } = dbVersion;
        path += `?articles=${articles}&tap=${tap}`;
        // path += `?tap=${tap}`;
    }

    console.timeLog('t', 'start fetching remote');
    const data = await fetchWithFeatures(path);
    console.timeLog('t', 'end fetching remote');

    if (data.session) {
        data.cards = await restoreCards(data.session);
    } else {
        data.session = data.cards.map(card => card.number);

        if (data.patch) {
            const storedCards = await restoreCards(data.session);

            const updatedCards = [];
            for (let i = 1; i < storedCards.length; i++) {
                updatedCards.push({ ...storedCards[i], ...data.cards[i] });
            }
            data.cards = updatedCards;
        }
    }
    console.log(data);

    console.timeLog('t', 'prepared session');

    return data;
});