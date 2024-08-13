import { useSelector } from "react-redux";
import { getEditedCard } from "./listSlice";

export default function CardEditor() {
    const card = useSelector(getEditedCard);
    // const card = useSelector(state => state.list.editedCard);
    // console.log(card);

    return (
        <section>
            <h1>Edit!</h1>
            <input
                type="number"
                name="card-number"
                value={card.main?.number}
                defaultValue="1"
                onChange={(e) => console.log(e.target.value)}
            />
            <input
                type="text"
                name="word"
                value={card.main?.word || ''}
            />
        </section>
    );
}