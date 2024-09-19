import { useDispatch, useSelector } from "react-redux";
// import { getSelectedCardId, selectCardById, updateCard, saveNewCard, deleteCard } from "./listSlice";
// import { getSelectedCardId, selectCardById } from "./listSlice";
// import { getSelectedCard, getSelectedCardId } from "./listSlice";
// import { selectCardById } from "../cards/cardsSlice";
import { updateCard, saveNewCard, deleteCard } from "../cards/cardsThunks";
import LazyTextInput from "../../components/LazyTextInput";
import { getSelectedCardNumber } from "./listSlice";
import { selectCardByNumber, updateCardLocally } from "../cards/cardsSlice";

export default function CardEditor() {
    const dispatch = useDispatch();
    // const cardId = useSelector(getSelectedCardId);
    // const card = useSelector(state => selectCardById(state, cardId));
    const cardNumber = useSelector(getSelectedCardNumber);
    const card = useSelector(state => selectCardByNumber(state, cardNumber));
    // const card = useSelector(getSelectedCard);
    console.log(card);

    function update({ name, value }) {
        const data = {
            // id: card.id,
            id: card.number,
            dbid: card.dbid,
            changes: {
                [name]: value
            }
        };
        console.log(data);

        if (card.dbid < 0) { // if card is absolutely new, we are trying to create it on server
            data.changes.dbid = 0; 
            dispatch(saveNewCard(data)); 
        } else if(card.dbid === 0) { // saving changes locally, while waiting for card to be created on server
            dispatch(updateCardLocally(data));
        } else if(card.dbid > 0) { // existing card is normally updated
            dispatch(updateCard(data));
        }

    }

    function handleDelete() {
        if(!confirm('Delete this card?')) return;

        dispatch(deleteCard(card.id));
    }

    return (
        <section className="card-editor">
            <button onClick={handleDelete}>delete</button>
            <div className="word-fileds">
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
    