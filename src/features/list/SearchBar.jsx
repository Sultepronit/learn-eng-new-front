import { useSelector, useDispatch } from "react-redux";
import { selectCardsTotal } from "../cards/cardsSlice";
import {
    selectRerverseValue,
    toggleReverse,
    getSelectedCardNumber,
    setSelectedCardNumber,
    selectSeqrchQuery,
    search,
    selectPreparedList,
    sort
} from "./listSlice";
import checkIntLimits from "../../helpers/chekIntLimits";

export default function SearchBar({ setFirstRowWithCaution }) {
    const dispatch = useDispatch();

    const maxNumber = useSelector(selectCardsTotal);
    const selectedCardNumber = useSelector(getSelectedCardNumber);
    const searchQeury = useSelector(selectSeqrchQuery);
    const reverseValue = useSelector(selectRerverseValue);
    const preparedList = useSelector(selectPreparedList);

    function changeDisplayRange(inputNumber) {
        const foundIndex = preparedList.findIndex(cardNumber => cardNumber === inputNumber);
        if(foundIndex < 0) return;
        setFirstRowWithCaution(foundIndex);
    }

    function selectCard(inputNumber) {
        const cardNumber = checkIntLimits(inputNumber, 1, maxNumber);
        dispatch(setSelectedCardNumber(cardNumber));
        changeDisplayRange(cardNumber);
    }

    const sortOptions = [
        { value: 'number', label: 'number' },
        { value: 'repeatStatus', label: 'repeat status' },
        { value: 'writeStatus', label: 'write status' },
    ];

    return (
        <section className="search-bar">
            <input
                type="number"
                name="card-number"
                className="card-number-input"
                value={selectedCardNumber}
                onChange={(e) => selectCard(e.target.value)}
            />

            <input
                type="text"
                name="search-text"
                value={searchQeury}
                onChange={(e) => dispatch(search(e.target.value))}
            />

            <button
                onClick={() => dispatch(toggleReverse())}
            >
                {reverseValue ? '↑' : '↓'}
            </button>

            <select
                name="sort-column"
                onChange={(e) => dispatch(sort(e.target.value))}
            >
                {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </section>
    )
}