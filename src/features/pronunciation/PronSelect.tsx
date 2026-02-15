import { useDispatch } from "react-redux";
import { PronList } from "./types";
import { setTrackIndex } from "./pronunciationSlice";
import asyncPlayback from "./asyncPlayback";
import { useAppDispatch } from "../../app/store";
import { deleteTrack } from "./speakThunks";

export default function PronSelect({ variantI, list }: { variantI: number, list: PronList }) {
    // const dispatch = useDispatch();
    const dispatch = useAppDispatch();
    function handleChange(e) {
        const trackI = Number(e.target.value)
        asyncPlayback(list.list[trackI].url);
        dispatch(setTrackIndex({ variantI, trackI }));
    }
    const current = list.list[list.currentIndex];
    const isSynth = current.type === "synth";

    return (
        <>
            <select value={list.currentIndex} onChange={handleChange}>
                {list.list.map((o, i) => (
                    <option key={i} value={i}>{o.code}</option>
                ))}
            </select>
            <button
                className="small-button"
                onClick={() => asyncPlayback(list.list[list.currentIndex].url)}
            >🔊</button>
            <button
                className="small-button"
                disabled={!isSynth}
                onClick={() => dispatch(deleteTrack(current.url))}
                // onClick={() => dispatch(deleteTrack('asd'))}
            >❌</button>
        </>
    )
}