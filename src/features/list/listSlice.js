import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import fetchWithFeatures from "../../services/fetchWithFeatures";
import logProxy from "../../dev-helpers/logProxy";
import updateWithQueue from "../../services/updateQueue";

const cardsAdapter = createEntityAdapter();

const initialState = cardsAdapter.getInitialState({
    selectedCard: {}
});

export const fetchData = createAsyncThunk('data/fetchData', async () => {
    return await fetchWithFeatures('/words');
});

export const updateCard = createAsyncThunk('data/updateCard', async ({ dbId, changes }) => {
    console.log('Saving...', JSON.stringify(changes));
    // return await fetchWithFeatures(`/words/${id}`, 'PATCH', JSON.stringify(changes), false);
    // return await fetchWithFeatures(`/words/${id}`, 'PATCH', JSON.stringify(changes));
    return await updateWithQueue('/words', dbId, changes);
});

const listSlice = createSlice({
    name: 'list',
    // initialState: {
    //     data: [],
    //     selectedCard: emptyCard
    // },
    initialState,
    reducers: {
        selectCard: (state, action) => {
            state.selectedCard = action.payload;
            console.log(state.selectedCard);
        },
        selectCardByIndex: (state, action) => {
            const inputIndex = Math.round(action.payload);
            const lastIndex = state.data.length - 1;
            const index = inputIndex < 0 ? 0 : inputIndex > lastIndex ? lastIndex : inputIndex;

            state.selectedCard = state.data[index];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchData.fulfilled, (state, action) => {
                // state.data = action.payload;
                cardsAdapter.upsertMany(state, action.payload);
            })
            .addCase(updateCard.pending, (state, action) => {
                console.log(action.meta.arg);
                // const { index, changes } = action.meta.arg;
                // const card = state.data[index];
                // const { block, fields } = changes;
                // // logProxy(card[block]);
                // for(const title in fields) {
                //     card[block][title] = fields[title];
                // }
                const { id, changes } = action.meta.arg;
                cardsAdapter.updateOne(state, { id, changes });
                // console.log({
                //     id,
                //     changes: {
                //         [changes.block]: changes.fields
                //     }
                // });
                // cardsAdapter.updateOne(state, {
                //     id,
                //     changes: {
                //         [changes.block]: changes.fields
                //     }
                // });
                // cardsAdapter.upsertOne(state, {
                //     id,
                //     [changes.block]: changes.fields
                //     // changes: {
                //     //     [changes.block]: changes.fields
                //     // }
                // });
            })
    }
});

// export const selectData = (state) => state.list.data;
export const {
    selectAll: selectData,
    selectIds: selectCardIds,
    selectById: selectCardById
} = cardsAdapter.getSelectors(state => state.list);

export const getSelectedCard = (state) => state.list.selectedCard;

export const { selectCard, selectCardByIndex } = listSlice.actions;

export default listSlice.reducer;