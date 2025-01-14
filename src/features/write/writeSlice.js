import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { getSession } from "./writeThunks";
import logProxy from "../../dev-helpers/logProxy";
import parseWord from "../../services/wordParser";
import { directions } from "./statuses";

const cardsAdapter = createEntityAdapter({
    selectId: (card) => card.number
});

const initialState = cardsAdapter.getInitialState({
    session: null, // null in the beggining, [] in the end
    sessionLength: 0,
    progress: {
        tries: 0,
        cardsPassed: 0,
        good: 0,
        retry: 0,
        upgrade: 0,
        degrade: 0
    },
    currentCard: null,
    nextRepeated: 0
});

const writeSlice = createSlice({
    name: 'write',
    initialState,
    reducers: {
        setCurrentCard: (state, action) => {
            state.currentCard = action.payload;
        },
        updateCardState: (state, action) => {
            cardsAdapter.updateOne(state, action.payload);
        },
        updateSession: (state, action) => {
            state.session.pop();
            if (action.payload) {
                state.session.unshift(action.payload);
            }
        },
        updateProgress: (state, action) => {
            console.log(action.payload);
            const { updates } = action.payload; // ???
            state.progress.tries++;
            state.progress.cardsPassed = state.sessionLength - state.session.length;
            for (const field of updates) {
                state.progress[field]++;
            }
            // logProxy(state.progress);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSession.fulfilled, (state, action) => {
                const {
                    cards,
                    session,
                    sessionLength,
                    nextRepeated
                } = action.payload;
                cardsAdapter.setAll(state, cards);
                state.session = session;
                state.sessionLength = sessionLength;
                state.nextRepeated = nextRepeated;

                logProxy(state);
            });
    }
});

export const {
    setCurrentCard,
    updateCardState,
    updateSession,
    updateProgress
} = writeSlice.actions;

export const selectSession = (state) => state.write.session;
export const selectNextRepeated = (state) => state.write.nextRepeated;
export const selectCurrentCard = (state) => state.write.currentCard;
export const selectProgress = (state) => state.write.progress;
export const selectSessionLength = (state) => state.write.sessionLength;
const selectNextCardNumber = (state) => state.write.session[state.write.session.length - 1];

export const {
    selectById: selectCardByNumber
} = cardsAdapter.getSelectors(state => state.write);

export const getNextCard = () => (dispatch, getState) => {
    const nextCardNumber = selectNextCardNumber(getState());
    const rawCard = selectCardByNumber(getState(), nextCardNumber);
    // console.log(nextCardNumber, rawCard);

    const parsedCard = {
        ...rawCard,
        word: parseWord(rawCard?.word),
        direction: rawCard.writeFProgress > rawCard.writeBProgress ? directions.BACKWARD : directions.FORWARD,
        // direction: Math.random() > 0.5 ? directions.BACKWARD : directions.FORWARD
    };

    dispatch(setCurrentCard(parsedCard));
}

export default writeSlice.reducer;