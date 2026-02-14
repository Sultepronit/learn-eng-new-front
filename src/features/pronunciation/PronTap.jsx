import { useDispatch } from "react-redux";
import { speakNewly } from "./speakThunk";
import PronListView from "./PronListView";

export default function PronTap() {
    const dispatch = useDispatch();

    return (
        <div>
            <PronListView />
            <button className="speaker" onClick={() => dispatch(speakNewly())}>🔊</button>
        </div>
    )
}