import { useDispatch, useSelector } from "react-redux";
import { getSelectedCardId, selectCardById, updateCard } from "./listSlice";
// import { useEffect, useRef, useState } from "react";
import LazyTextInput from "../../components/LazyTextInput";

export default function CardEditor() {
    const dispatch = useDispatch();
    const cardId = useSelector(getSelectedCardId);
    const card = useSelector(state => selectCardById(state, cardId));
    // console.log(cardId);
    console.log(card);

    // function select(number) {
    //     dispatch(selectCardByIndex(number));
    // }

    function update({ name, value }) {
        const data = {
            id: card.id,
            dbId: card.dbId,
            changes: {
                [name]: value
            }
        };
        console.log(data);
        dispatch(updateCard(data));
    }

    return (
        <section>
            <div className="word-filed">
                <LazyTextInput
                    name="word"
                    value={card.word}
                    placeholder="word"
                    className="edit-filed"
                    onChange={update}
                />
                <LazyTextInput
                    name="transcription"
                    value={card.transcription}
                    placeholder="transcription"
                    className="edit-filed"
                    onChange={update}
                    
                />
            </div>
            <LazyTextInput
                name="translation"
                value={card.translation}
                placeholder="translation"
                className="edit-filed"
                onChange={update}
            />
            <LazyTextInput
                name="example"
                value={card.example}
                placeholder="example"
                className="edit-filed"
                onChange={update}
            />
        </section>
    );
}