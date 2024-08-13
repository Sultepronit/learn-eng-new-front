import { useDispatch, useSelector } from "react-redux";
import { getSelectedCard, selectCardByNumber } from "./listSlice";

export default function CardEditor() {
    const dispatch = useDispatch();
    const card = useSelector(getSelectedCard);
    // const card = useSelector(state => state.list.editedCard);
    // console.log(card);

    function select(number) {
        dispatch(selectCardByNumber(number));
    }

    return (
        <section>
            <h1>Edit!</h1>
            <input
                type="number"
                name="card-number"
                value={card.main?.number}
                onChange={(e) => select(e.target.value)}
            />
            <input
                type="text"
                name="word"
                value={card.main?.word}
            />
        </section>
    );
}