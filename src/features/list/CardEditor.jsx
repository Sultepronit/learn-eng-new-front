import { useDispatch, useSelector } from "react-redux";
import { getSelectedCard, selectCardByNumber, updateCard } from "./listSlice";
import { useEffect, useRef, useState } from "react";

export default function CardEditor() {
    const dispatch = useDispatch();
    const card = useSelector(getSelectedCard);
    // const [editedCard, setEditedCard] = useState(card);
    // const card = useSelector(state => state.list.editedCard);
    // console.log(card);
    // console.log(editedCard);

    function select(number) {
        dispatch(selectCardByNumber(number));
    }

    function update(id, number, group, changes) {
        const data = {
            id,
            number,
            group,
            changes
        };
        console.log(data);
        dispatch(updateCard(data));
    }

    // const [localCard, setLocalCard] = useState({ word: '', smth: '444' });
    const [localCard, setLocalCard] = useState(card);

    const wordRef = useRef(null);

    useEffect(() => {
        setLocalCard(card);
        // console.log(wordRef.current);
        wordRef.current.value = card.main.word;
    }, [card]);

    function handleChange(event) {
        // console.log(localCard.main.word);
        const { name, value } = event.target;
        // console.log(name.split('.'));
        // console.log(name, value);
        const [group, field] = name.split('.');

        // setLocalCard({ ...localCard, [name]: value });
        const newGroup = { ...localCard[group], [field]: value };
        // console.log(newGroup);
        setLocalCard({ ...localCard, [group]: newGroup });
        // console.log(localCard.main.word);
        update(card.id, card.number, group, value)
    }

    function handleKeyUp(event) {
        console.log(event);
        console.log(event.key);
        if(!(event.type !== 'bluer' || event.key !== 'Enter')) return;

        const { name, value } = event.target;
        const [group, field] = name.split('.');

        // console.log(group, field, value);
        console.log(name, value);
        console.log(card[group][field]);
    }

    // console.log(localCard);

    return (
        <section>
            <h1>Edit!</h1>
            <input
                type="number"
                name="card-number"
                value={card.number}
                onChange={(e) => select(e.target.value)}
            />
            <input
                type="text"
                name="main.word"
                ref={wordRef}
                // value={localCard.main.word}
                // defaultValue={card.main?.word}
                // onChange={handleChange}
                // value={card.main?.word}
                // value={editedCard.main.word}
                // onChange={(e) => setEditedCard({...editedCard, ...{word: e.target.value}})}
                // onChange={(e) => update(card.id, card.number, 'word', e.target.value)}
                // onChange={(e) => update(card.id, card.number, 'article', {word: e.target.value})}
                // onInput={(e) => console.log(e.target.value)}
                // onSubmit={(e) => console.log(e.target.value)}
                onKeyUp={handleKeyUp}
                onBlur={handleKeyUp}
            />
        </section>
    );
}