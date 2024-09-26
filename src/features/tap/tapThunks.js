import { createAsyncThunk } from "@reduxjs/toolkit";
import fetchWithFeatures from "../../services/fetchWithFeatures";

export const getSession = createAsyncThunk('tap/getSession', async (dbVersion) => {
    let path = '/tap-session';

    if(dbVersion) {
        const { articles, tap } = dbVersion;
        path += `?articles=${articles}&tap=${tap}`;
    }

    console.timeLog('t', 'start fetching remote');
    const list = await fetchWithFeatures(path);
    console.timeLog('t', 'end fetching remote');
    return list;
});