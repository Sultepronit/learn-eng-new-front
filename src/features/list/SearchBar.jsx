import { useSelector } from "react-redux";
import { getRerverseValue, getSelectedCardId, setSelectedCardId, toggleReverse } from "./listSlice";
import { useDispatch } from "react-redux";

export default function SearchBar() {
    const dispatch = useDispatch();

    const reverseValue = useSelector(getRerverseValue);

    return (
        <section>
            <input
                type="number"
                name="card-number"
                value={useSelector(getSelectedCardId)}
                onChange={(e) => dispatch(setSelectedCardId(e.target.value))}
            />

            <button
                onClick={() => dispatch(toggleReverse())}
            >
                {reverseValue ? '↑' : '↓'}
            </button>
        </section>
    )
}