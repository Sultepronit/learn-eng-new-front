import { createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import { getSession } from "./tapThunks";
import logProxy from "../../dev-helpers/logProxy";
import { directions, stages } from "./statuses";

const cardsAdapter = createEntityAdapter({
    selectId: (card) => card.number
});

const initialState = cardsAdapter.getInitialState({
    session: [],
    stages: null,
    showAnswer: false
});

const tapSlice = createSlice({
    name: 'tap',
    initialState,
    reducers: {
        decrementSession: (state) => {
            state.session.pop();
        },
        rearrangeSession: (state) => {
            state.session.unshift(state.session.pop());
        },
        toggleQuestionAnswer: (state) => {
            state.showAnswer = !state.showAnswer;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSession.fulfilled, (state, action) => {
                const { cards, session, stages } = action.payload;
                cardsAdapter.setAll(state, cards);
                state.session = session;
                state.stages = stages;
                logProxy(state);
            });
    }
});

export const {
    decrementSession,
    rearrangeSession,
    toggleQuestionAnswer
} = tapSlice.actions;

export const selectSession = (state) => state.tap.session;
export const selectStages = (state) => state.tap.stages;
const selectNextCardNumber = (state) => state.tap.session[state.tap.session.length - 1];

const {
    selectById: selectRawCard,
    selectAll: selectAllCards
} = cardsAdapter.getSelectors(state => state.tap);

// thunk, is what this thing called
export const getNextCard = () => (dispatch, getState) => {
    const nextCardNumber = selectNextCardNumber(getState());
    const rawCard = selectRawCard(getState(), nextCardNumber);
    // dispatch(setSelectedCard(card));
    console.log(rawCard);  
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

// export const selectNextCard = createSelector(
//     [selectRawCard, (state) => state.tap.session],
//     (rawCard, session) => {
//         const lastCardNumber = session[session.length - 1];
//         console.log(lastCardNumber);

//     }
// );

// export const selectNextCard = createSelector(
//     [selectAllCards, (state) => state.tap.session],
//     (cards, session) => {
//         const lastCardNumber = session[session.length - 1];
//         console.log(lastCardNumber);
//         console.log(cards);
//     }
// );

export default tapSlice.reducer;