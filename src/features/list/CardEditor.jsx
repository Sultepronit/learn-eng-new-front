import { useDispatch, useSelector } from "react-redux";
import { getSelectedCard, selectCardByNumber, updateCard } from "./listSlice";
import { useEffect, useRef, useState } from "react";
import LazyTextInput from "../../components/LazyTextInput";

export default function CardEditor() {
    const dispatch = useDispatch();
    const card = useSelector(getSelectedCard);

    function select(number) {
        dispatch(selectCardByNumber(number));
    }

    function update({ name, value }) {
        console.log(name, value);
        const [block, field] = name.split('.');
        const data = {
            id: card.id,
            index: card.number - 1,
            changes: {
                block,
                fields: {
                    [field]: value
                }
            }
        };
        console.log(data);
        dispatch(updateCard(data));
    }

    return (
        <section>
            <h1>Edit!</h1>
            <input
                type="number"
                name="card-number"
                value={card.number}
                onChange={(e) => select(e.target.value)}
            />
            <LazyTextInput
                name="main.word"
                value={card.main.word}
                onChange={update}
            />
            <LazyTextInput
                name="main.translation"
                value={card.main.translation}
                onChange={update}
            />
        </section>
    );
}