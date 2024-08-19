import { useSelector } from "react-redux";
import { getSelectedCardId, setSelectedCardId } from "./listSlice";
import { useDispatch } from "react-redux";

export default function SearchBar() {
    const dispatch = useDispatch();
    return (
        <section>
            <input
                type="number"
                name="card-number"
                value={useSelector(getSelectedCardId)}
                onChange={(e) => dispatch(setSelectedCardId(e.target.value))}
            />
        </section>
    )
}