import { useSelector } from "react-redux";
import { getRerverseValue, getSelectedCardId, setSelectedCardId, setSelectedCardIdByNumber, toggleReverse } from "./listSlice";
import { useDispatch } from "react-redux";
import checkIntLimits from "../../helpers/chekIntLimits";
import { selectCardsTotal } from "../cards/cardsSlice";
// import { selectCardsNumber } from "../cards/cardsSlice";

export default function SearchBar({ changeDisplayRange }) {
    const dispatch = useDispatch();
    const cardsTotal = useSelector(selectCardsTotal);

    function selectCard(cardNumber) {
        const adequate = checkIntLimits(cardNumber, 1, cardsTotal);
        
        console.log(cardNumber, adequate);
        dispatch(setSelectedCardIdByNumber(Number(cardNumber)));
        changeDisplayRange(cardNumber);
    }

    const reverseValue = useSelector(getRerverseValue);

    return (
        <section className="search-bar">
            <input
                type="number"
                name="card-id"
                className="card-id"
                value={useSelector(getSelectedCardId)}
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