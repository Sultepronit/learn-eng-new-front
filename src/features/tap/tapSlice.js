import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { getSession } from "./tapThunks";
import logProxy from "../../dev-helpers/logProxy";
import { directions, stages } from "./statuses";

const cardsAdapter = createEntityAdapter({
    selectId: (card) => card.number
});

const initialState = cardsAdapter.getInitialState({
    session: [],
    stages: null,
    progress: {
        tries: 0,
        initialCardsNumber: 35,
        cardsPassed: 0,
        learn: { good: 0, retry: 0, upgrade: 0 },
        confirm: { good: 0, retry: 0, upgrade: 0, degrade: 0 },
        repeat: { good: 0, retry: 0, upgrade: 0, degrade: 0 }
    },
    resetIsActual: false
});

const tapSlice = createSlice({
    name: 'tap',
    initialState,
    reducers: {
        removeReset: (state) => {
            state.resetIsActual = false;
        },
        updateCardState: (state, action) => {
            cardsAdapter.updateOne(state, action.payload);
            console.log('updated the state');
        },
        updateSession: (state, action) => {
            state.session.pop();
            if (action.payload) {
                state.session.unshift(action.payload);
            }
        },
        updateProgress: (state, action) => {
            console.log(action.payload);
            const { stage, updates } = action.payload;
            state.progress.tries++;
            state.progress.cardsPassed = state.progress.initialCardsNumber - state.session.length;
            for (const field of updates) {
                state.progress[stage][field]++;
            }
            // console.log(state.progress);
            logProxy(state.progress);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSession.fulfilled, (state, action) => {
                const { cards, session, stages, backup } = action.payload;
                cardsAdapter.setAll(state, cards);
                state.session = session;
                state.stages = stages;

                state.resetIsActual = !!backup;
                logProxy(state);
            });
    }
});

export const {
    removeReset,
    updateCardState,
    updateSession,
    updateProgress
} = tapSlice.actions;

export const selectSession = (state) => state.tap.session;
export const selectStages = (state) => state.tap.stages;
export const selectResetIsActual = (state) => state.tap.resetIsActual;
const selectNextCardNumber = (state) => state.tap.session[state.tap.session.length - 1];

export const {
    selectById: selectCardByNumber
} = cardsAdapter.getSelectors(state => state.tap);

// thunk, is what this thing called
export const getNextCard = () => (dispatch, getState) => {
    const nextCardNumber = selectNextCardNumber(getState());
    const rawCard = selectCardByNumber(getState(), nextCardNumber);

    return {
        ...rawCard,
        get repeatStage() {
            return this.repeatStatus === 0 ? stages.LEARN
                : this.repeatStatus === 1 ? stages.CONFIRM : stages.REPEAT;
        },
        get direction() {
            return this.tapFProgress > this.tapBProgress
                ? directions.BACKWARD : directions.FORWARD;
        }
    }
}

export default tapSlice.reducer;