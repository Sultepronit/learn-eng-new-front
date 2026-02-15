import { useDispatch } from "react-redux";
import { speakNewly } from "./speakThunks";
import PronListView from "./PronListView";
import { useAppDispatch } from "../../app/store";

export default function PronTap() {
    // const dispatch = useDispatch();
    const dispatch = useAppDispatch();

    return (
        <div className="speak-block">
            <div className="pron-list">
                <PronListView />
            </div>
            <button className="speaker" onClick={() => dispatch(speakNewly())}>🔊</button>
        </div>
    )
}