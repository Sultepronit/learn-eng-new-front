import { createListenerMiddleware } from "@reduxjs/toolkit";
import { cardChanged } from "./events";
import { preparePronList } from "../features/pronunciation/audioSources";
import { setPronList } from "../features/pronunciation/pronunciationSlice";

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
    actionCreator: cardChanged,

    effect: async (action, listenerApi) => {
        const card = action.payload;
        console.log(card);
        if (!card) return;

        const variants = card.word.toPlay ? card.word.toPlay : [card.word]
        // console.log(variants);

        const pronList = await preparePronList(variants);

        listenerApi.dispatch(setPronList(pronList))
    }
});
