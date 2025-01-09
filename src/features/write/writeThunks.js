import { createAsyncThunk } from "@reduxjs/toolkit";
import fetchWithFeatures from "../../services/fetchWithFeatures";

async function fetchSession() {
    console.timeLog('t', 'start fetching remote');
    const data = await fetchWithFeatures('/write-session');
    console.timeLog('t', 'end fetching remote');

    return data;
}

export const getSession = createAsyncThunk('write/getSession', async () => {  
    const data = await fetchSession();

    // if (data.session) {
    //     // data.session[data.session.length - 1] = 624;
    //     // data.session[data.session.length - 1] = 382;
    //     data.cards = await restoreCards(data.session);

    //     updatable = data.backup ? data.updatable : true;
    // } else {
    //     data.session = data.cards.map(card => card.number);

    //     const storedCards = await restoreCards(data.session);
    //     console.log(storedCards);
        
    //     data.cards = storedCards.map((storedCard, index) => ({ ...storedCard, ...data.cards[index]}));

    //     setBackup(data.cards);
    // }

    // if (!data.backup) data.sessionLength = data.session.length;

    // if (!data.backup) bakcupSessionConsts(data, updatable);
    data.sessionLength = data.cards.length;
    
    console.log(data);

    // console.timeLog('t', 'prepared session');

    return data;
});