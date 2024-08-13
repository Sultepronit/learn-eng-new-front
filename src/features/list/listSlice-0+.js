import { createSlice } from "@reduxjs/toolkit";

const listSlice = createSlice({
    name: 'list',
    initialState: {
        data: [],
        selectedCard: {}
    },
    reducers: {
        selectCard: (state, action) => {
            state.selectedCard = action.payload
            // console.log(action);
            console.log(state.selectedCard);
        }
    }
});

export const getEditedCard = (state) => state.list.editedCard;

export const { selectCard } = listSlice.actions;

export default listSlice.reducer;