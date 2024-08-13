import { createSlice } from "@reduxjs/toolkit";

const listSlice = createSlice({
    name: 'list',
    initialState: {
        editedCard: {}
    },
    reducers: {
        selectCard: (state, action) => {
            state.editedCard = action.payload
            // console.log(action);
            console.log(state.editedCard);
        }
    }
});

export const getEditedCard = (state) => state.list.editedCard;

export const { selectCard } = listSlice.actions;

export default listSlice.reducer;