import { useDispatch } from "react-redux";
import { speakNewly } from "./speakThunk";

export default function PronDetails() {
    const dispatch = useDispatch();

    return (
        <div>
            <button className="speaker" onClick={() => dispatch(speakNewly())}>🔊</button>
        </div>
    )
}