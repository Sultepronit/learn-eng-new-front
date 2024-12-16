import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCard, saveNewCard, deleteCard } from "../cards/cardsThunks";
import LazyTextInput from "../../components/LazyTextInput";
import { getSelectedCardNumber } from "./listSlice";
import { selectCardByNumber, updateCardState } from "../cards/cardsSlice";
import FindMatchesInput from "../../components/FindMatchesInput";

// export default function CardEditor() {
const CardEditor = React.memo(function CardEditor() {
    const dispatch = useDispatch();
    const cardNumber = useSelector(getSelectedCardNumber);
    const card = useSelector(state => selectCardByNumber(state, cardNumber));
    console.log(card);
    const parts = card.word.split('/');
    if (parts.length > 1) {
        console.log(parts);
        for (let i = 1; i * 2 < parts.length; i++) {
            // console.log(i, i + (parts.length - 1) / 2)
            console.log(parts[i], parts[i + (parts.length - 1) / 2]);
        }
    }

    function update({ name, value }) {
        const data = {
            number: card.number,
            dbid: card.dbid,
            changes: {
                [name]: value
            }
        };
        // console.log(data);

        if(card.dbid > 0) { // existing card is normally updated
            dispatch(updateCard(data));
        } else if (card.dbid < 0) { // absolutely new card, is going to be created on the server
            data.changes.dbid = 0; // next changes would not lead here
            dispatch(saveNewCard(data)); 
        } else { // new card, wating for server response, updates are going only to the state
            dispatch(updateCardState({ id: data.number, changes: data.changes }));            
        }
    }

    function handleDelete() {
        if(!confirm('Delete this card?')) return;

        dispatch(deleteCard(card.dbid));
    }

    return (
        <section className="card-editor">
            <div className="top-row">
                <p className="card-number">{card.number}</p>
                <input
                    type="number"
                    name="repeatStatus"
                    title="repeat status"
                    className="digit-5"
                    value={card.repeatStatus}
                    onChange={e => update(e.target)}
                />
                <input
                    type="number"
                    name="tapFProgress"
                    title="tap forward progress"
                    className="digit-2"
                    value={card.tapFProgress}
                    onChange={e => update(e.target)}
                />
                <input
                    type="number"
                    name="tapBProgress"
                    title="tap backward progress"
                    className="digit-2"
                    value={card.tapBProgress}
                    onChange={e => update(e.target)}
                />
                <button onClick={handleDelete} disabled={card.dbid < 1}>delete</button>
            </div>
            
            <div className="word-fileds">
                {card.repeatStatus < 0 ? (
                        <FindMatchesInput
                            name="word"
                            value={card.word}
                            placeholder="word"
                            className="edit-filed"
                            onChange={update}
                        />  
                    ) : (
                        <LazyTextInput
                            name="word"
                            value={card.word}
                            placeholder="word"
                            className="edit-filed"
                            onChange={update}
                        />  
                    )
                }
                
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
});

export default CardEditor;