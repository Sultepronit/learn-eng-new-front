import { useSelector } from "react-redux";
import { getRerverseValue, getSelectedCard, setSelectedCard, toggleReverse } from "./listSlice";
import { useDispatch } from "react-redux";
import checkIntLimits from "../../helpers/chekIntLimits";
import { selectAllCards } from "../cards/cardsSlice";
// import { selectCardsNumber } from "../cards/cardsSlice";

export default function SearchBar({ changeDisplayRange }) {
    const dispatch = useDispatch();
    const allCards = useSelector(selectAllCards);
    const selectedCard = useSelector(getSelectedCard);

    function selectCard(cardNumber) {
        const adequate = checkIntLimits(cardNumber, 1, allCards.length);
        const selectedCard = allCards.find(card => card.number === adequate); // yeah, inner one
        // console.log(selectedCard);
        dispatch(setSelectedCard(selectedCard));
        changeDisplayRange(selectedCard.id);
    }

    const reverseValue = useSelector(getRerverseValue);

    return (
        <section className="search-bar">
            <input
                type="number"
                name="card-id"
                className="card-id"
                value={selectedCard.number}
                onChange={(e) => selectCard(e.target.value)}
            />

            <button
                onClick={() => dispatch(toggleReverse())}
            >
                {reverseValue ? '↑' : '↓'}
            </button>
        </section>
    )
}