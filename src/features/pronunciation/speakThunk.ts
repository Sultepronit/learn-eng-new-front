import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { setTrackIndex, setStale } from "./pronunciationSlice";
import asyncPlayback from "./asyncPlayback";

export const speakNewly = createAsyncThunk(
    'pronunciation/speak',
    async (_, { getState, dispatch }) => {
        const state = getState() as RootState;
        const pronList = state.pronunciation.list;
        
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
                
                const result = await asyncPlayback(track.url);
                console.log(result);
                if (result === 'ended') break;
            }
        }
    }
)