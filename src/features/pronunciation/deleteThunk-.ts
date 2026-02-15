import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { setTrackIndex, setStale } from "./pronunciationSlice";
import asyncPlayback from "./asyncPlayback";

export const deleteTrack = createAsyncThunk(
    'pronunciation/delete',
    async (url: string) => {
        try {
            const resp = await fetch(url, { method: 'DELETE' });
            const result = await resp.json();
            console.log(result);
        } catch (error) {
            console.warn(error);
        }
        
    }
)