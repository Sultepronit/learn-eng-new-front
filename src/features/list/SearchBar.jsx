import { useSelector } from "react-redux";
import { getRerverseValue, toggleReverse, getSelectedCardNumber, setSelectedCardNumber } from "./listSlice";
import { useDispatch } from "react-redux";
import checkIntLimits from "../../helpers/chekIntLimits";
import { selectCardsTotal } from "../cards/cardsSlice";

export default function SearchBar({ changeDisplayRange }) {
    const dispatch = useDispatch();
    const maxNumber = useSelector(selectCardsTotal);
    const selectedCardNumber = useSelector(getSelectedCardNumber);

    function selectCard(inputNumber) {
        const cardNumber = checkIntLimits(inputNumber, 1, maxNumber);
        dispatch(setSelectedCardNumber(cardNumber));
        changeDisplayRange(cardNumber);
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