import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { setTrackIndex, setStale } from "./pronunciationSlice";
import asyncPlayback from "./asyncPlayback";

const tempUrlVersions: Record<string, number> = {};

export const speakNewly = createAsyncThunk(
    'pronunciation/speak',
    async (_, { getState, dispatch }) => {
        const state = getState() as RootState;
        const pronList = state.pronunciation.list;
        console.log(tempUrlVersions);
        for (const [variantI, variant] of pronList.entries()) {
            let trackI = variant.currentIndex;   
            let isStale = variant.isStale;     
            for (let tries = 0; tries < 6; tries++) {
                // console.log(variant.isStale, trackI);
                // if (variant.isStale) {
                if (isStale) {
                    trackI = (trackI + 1) % variant.list.length;
                    dispatch(setTrackIndex({ variantI, trackI }));
                } else {
                    isStale = true;
                    dispatch(setStale(variantI));
                }
                // console.log(trackI);
                const track = variant.list[trackI];
                
                const url = tempUrlVersions[track.url]
                    ? `${track.url}?v=${tempUrlVersions[track.url]}` : track.url;
                const volume = track.type === 'synth' ? 1 : 0.7;
                const result = await asyncPlayback(url, volume);
                console.log(result);
                if (result === 'ended') break;
            }
        }
    }
);

export const deleteTrack = createAsyncThunk(
    'pronunciation/delete',
    async (url: string) => {
        try {
            const resp = await fetch(url, { method: 'DELETE' });
            const result = await resp.json();
            console.log(result);
            if (tempUrlVersions[url]) {
                tempUrlVersions[url]++;
            } else {
                tempUrlVersions[url] = 1;
            }
            console.log(tempUrlVersions);
        } catch (error) {
            console.warn(error);
        }
        
    }
);