import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { getSession } from "./tapThunks";
import logProxy from "../../dev-helpers/logProxy";
import { directions, stages } from "./statuses";
import parseWord from "../../services/wordParser";

const cardsAdapter = createEntityAdapter({
    selectId: (card) => card.number
});

const initialState = cardsAdapter.getInitialState({
    session: null, // null in the beggining, [] in the end
    stages: [],
    progress: {
        sessionLength: 0,
        tries: 0,
        cardsPassed: 0,
        learn: { good: 0, retry: 0, upgrade: 0, degrade: 0 },
        confirm: { good: 0, retry: 0, upgrade: 0, degrade: 0 },
        repeat: { good: 0, retry: 0, upgrade: 0, degrade: 0 }
    },
    resetIsActual: false,
    currentCard: null,
    nextRepeated: 0
});

const tapSlice = createSlice({
    name: 'tap',
    initialState,
    reducers: {
        setCurrentCard: (state, action) => {
            state.currentCard = action.payload;
        },
        removeReset: (state) => {
            state.resetIsActual = false;
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
            // console.log(action.payload);
            const { stage, updates } = action.payload;
            state.progress.tries++;
            state.progress.cardsPassed = state.progress.sessionLength - state.session.length;
            for (const field of updates) {
                state.progress[stage][field]++;
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
                    progress,
                    sessionLength,
                    stages,
                    nextRepeated,
                    backup
                } = action.payload;
                cardsAdapter.setAll(state, cards);
                state.session = session;
                state.stages = stages;

                state.nextRepeated = nextRepeated;

                if (backup) {
                    state.resetIsActual = true;

                    state.progress = progress;
                } else {
                    state.progress.sessionLength = sessionLength;
                }

                // state.progress.sessionLength = sessionLength;

                // state.resetIsActual = !!backup;
                logProxy(state);
            });
    }
});

export const {
    setCurrentCard,
    removeReset,
    updateCardState,
    updateSession,
    updateProgress
} = tapSlice.actions;

export const selectSession = (state) => state.tap.session;
export const selectStages = (state) => state.tap.stages;
export const selectNextRepeated = (state) => state.tap.nextRepeated;
export const selectResetIsActual = (state) => state.tap.resetIsActual;
const selectNextCardNumber = (state) => state.tap.session[state.tap.session.length - 1];
export const selectCurrentCard = (state) => state.tap.currentCard;
export const selectProgress = (state) => state.tap.progress;

export const {
    selectById: selectCardByNumber
} = cardsAdapter.getSelectors(state => state.tap);

// thunk, is what this thing called
export const getNextCard = () => (dispatch, getState) => {
    const nextCardNumber = selectNextCardNumber(getState());
    const rawCard = selectCardByNumber(getState(), nextCardNumber);
    // console.log(nextCardNumber, rawCard);

    const parsedCard = {
        ...rawCard,
        word: parseWord(rawCard?.word),
        get repeatStage() {
            return this.repeatStatus === 0 ? stages.LEARN
                : this.repeatStatus === 1 ? stages.CONFIRM : stages.REPEAT;
        },
        get direction() {
            return this.tapFProgress > this.tapBProgress
                ? directions.BACKWARD : directions.FORWARD;
        }
    };

    dispatch(setCurrentCard(parsedCard));
}

export default tapSlice.reducer;