import { useDispatch, useSelector } from "react-redux";
import { getSelectedCard, selectCardByIndex, updateCard } from "./listSlice";
import { useEffect, useRef, useState } from "react";
import LazyTextInput from "../../components/LazyTextInput";

export default function CardEditor() {
    const dispatch = useDispatch();
    const card = useSelector(getSelectedCard);

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
                onChange={update}
            />
            <LazyTextInput
                name="transcription"
                value={card.transcription}
                onChange={update}
            />
            <LazyTextInput
                name="translation"
                value={card.translation}
                onChange={update}
            />
            <LazyTextInput
                name="example"
                value={card.example}
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