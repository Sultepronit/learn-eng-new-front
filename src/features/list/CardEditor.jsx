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
        const [block, field] = name.split('.');
        const data = {
            id: card.id,
            index: card.index,
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
            <LazyTextInput
                name="article.word"
                value={card.article?.word}
                onChange={update}
            />
            <LazyTextInput
                name="article.transcription"
                value={card.article?.transcription}
                onChange={update}
            />
            <LazyTextInput
                name="article.translation"
                value={card.article?.translation}
                onChange={update}
            />
            <LazyTextInput
                name="article.example"
                value={card.article?.example}
                onChange={update}
            />
            <br />
            <input
                type="number"
                name="card-number"
                value={card.index + 1}
                onChange={(e) => select(e.target.value - 1)}
            />
        </section>
    );
}