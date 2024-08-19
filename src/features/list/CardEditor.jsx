import { useDispatch, useSelector } from "react-redux";
import { getSelectedCardId, selectCardById, updateCard } from "./listSlice";
// import { useEffect, useRef, useState } from "react";
import LazyTextInput from "../../components/LazyTextInput";

export default function CardEditor() {
    const dispatch = useDispatch();
    // const card = useSelector(getSelectedCard);
    const cardId = useSelector(getSelectedCardId);
    const card = useSelector(state => selectCardById(state, cardId));
    const card2 = useSelector(state => selectCardById(state, cardId));
    console.log(cardId);
    console.log(card);

    function select(number) {
        dispatch(selectCardByIndex(number));
    }

    function update({ name, value }) {
        // console.log(name, value);
        // const [block, field] = name.split('.');
        const data = {
            id: card.id,
            dbId: card.dbId,
            changes: {
                // block,
                // fields: {
                //     [field]: value
                // }
                [name]: value
            }
        };
        console.log(data);
        dispatch(updateCard(data));
    }

    return (
        <section>
            <LazyTextInput
                name="word"
                value={card.word}
                placeholder="word"
                onChange={update}
            />
            <LazyTextInput
                name="transcription"
                value={card2?.transcription}
                placeholder="transcription"
                onChange={update}
            />
            <LazyTextInput
                name="translation"
                value={card.translation}
                placeholder="translation"
                onChange={update}
            />
            <LazyTextInput
                name="example"
                value={card2?.example}
                placeholder="example"
                onChange={update}
            />
            <br />
            {/* <input
                type="number"
                name="card-number"
                value={card.index + 1}
                onChange={(e) => select(e.target.value - 1)}
            /> */}
        </section>
    );
}