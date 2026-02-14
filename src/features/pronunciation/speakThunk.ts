import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { setCurrentIndex, setStale } from "./pronunciationSlice";
import asyncPlayback from "./asyncPlayback";

export const speakNewly = createAsyncThunk(
    'pronunciation/speak',
    async (_, { getState, dispatch }) => {
        const state = getState() as RootState;
        const pronList = state.pronunciation.list;
        console.log(pronList);
        for (const [vi, variant] of pronList.entries()) {
            let trackI = variant.currentIndex;
            if (variant.isStale) {
                trackI = (trackI + 1) % variant.list.length;
                dispatch(setCurrentIndex({ variantI: vi, trackI }));
            } else {
                dispatch(setStale(vi));
            }
            console.log(variant);
            
            const track = variant.list[trackI];
            console.log(trackI, track);
            for (let tries = 0; tries < 3; tries++) {
                const result = await asyncPlayback(track.url);
                console.log(result);
                if (result === 'ended') break;
            }
        }
    }
)