import { useSelector } from "react-redux";
// import { getRerverseValue, getSelectedCard, setSelectedCard, toggleReverse } from "./listSlice";
import { getRerverseValue, toggleReverse, getSelectedCardNumber, setSelectedCardNumber } from "./listSlice";
import { useDispatch } from "react-redux";
import checkIntLimits from "../../helpers/chekIntLimits";
import { selectCardsTotal } from "../cards/cardsSlice";
// import { selectAllCards } from "../cards/cardsSlice";
// import { selectCardsNumber } from "../cards/cardsSlice";

export default function SearchBar({ changeDisplayRange }) {
    const dispatch = useDispatch();
    // const allCards = useSelector(selectAllCards);
    const maxNumber = useSelector(selectCardsTotal);
    // const selectedCard = useSelector(getSelectedCard);
    const selectedCardNumber = useSelector(getSelectedCardNumber);

    function selectCard(cardNumber) {
        //do we need allCards?
        // const adequate = checkIntLimits(cardNumber, 1, allCards.length);
        const adequate = checkIntLimits(cardNumber, 1, maxNumber);
        // const selectedCard = allCards.find(card => card.number === adequate); 
        // console.log(selectedCard);
        // dispatch(setSelectedCard(selectedCard));
        dispatch(setSelectedCardNumber(adequate));

        // changeDisplayRange(selectedCard.id);
        changeDisplayRange(adequate);
    }

    const reverseValue = useSelector(getRerverseValue);

    return (
        <section className="search-bar">
            <input
                type="number"
                name="card-id"
                className="card-id"
                // value={selectedCard.number}
                value={selectedCardNumber}
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