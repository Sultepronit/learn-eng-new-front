import './tapStyle.css';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSession } from "./tapThunks";
import { getVersion } from "../../services/versionHandlers";
import { decrementSession, getNextCard, rearrangeSession, selectSession, selectStages } from "./tapSlice";
import { directions } from "./statuses";
import { pronounce } from '../../services/pronunciation';

export default function TapLessonView() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSession(getVersion()));
    }, [dispatch]);
    
    const stages = useSelector(selectStages);
    const session = useSelector(selectSession);

    const [card, setCard] = useState();
    const [questionMode, setQuestionMode] = useState(true);
    const toggleQuestionAnswer = () => setQuestionMode(!questionMode);

    useEffect(() => {
        setCard(dispatch(getNextCard()));
        console.log(session);
    }, [session]);

    function handleButton() {
        pronounce(card.word);
        if (!questionMode) {
            dispatch(rearrangeSession())
        }
        toggleQuestionAnswer();
    }

    console.log(card?.direction);

    return !stages ? '' : (
        <section className="tap-view">
            <div>
                <p>{stages.learn}</p>
            </div>

            <div className="card-view">
                <p className="word">{
                    questionMode && card.direction === directions.FORWARD ? '' : card.word
                }</p>
                <p className="transcription">{questionMode ? '' : card.transcription}</p>
                <p className="translation">{
                    questionMode && card?.direction === directions.BACKWARD ? '' : card.translation
                }</p>
                <p className="example">{questionMode ? '' : card.example}</p>
            </div>

            <div className="nav-buttons">
                <button onClick={handleButton}>
                    Next!
                </button>
            </div>
        </section>
    )
}