import { useDispatch } from "react-redux";
import { updateSession } from "./tapSlice";
import { useState } from "react";
import { directions, marks, stages } from "./statuses";
import evaluate from "./evaluation";
import { updateCard } from "./tapThunks";
import { speak } from "../pronunciation/pronunciation";
import setPause from "../../helpers/setPause";

export default function NavButtons({ card, questionMode, setQuestionMode }) {
    const dispatch = useDispatch();

    const [good, neutral, retry, bad] = ['good', 'neutral', 'retry', 'bad'];
    const [buttons, setButtons] = useState({ neutral });

    const [learningPronunciation, setLearningPronunciation] = useState(false);

    function pronounceAndPrepareEvaluation() {
        setLearningPronunciation(true);
        // speak().then(() => setLearningPronunciation(false));
        Promise.any([
            speak(),
            setPause(2000)
        ]).then(() => setLearningPronunciation(false));

        if (card.repeatStage === stages.CONFIRM) {
            setButtons({ good, neutral, bad });
        } if (card.repeatStage === stages.LEARN && card.direction === directions.FORWARD) {
            setButtons({ good, retry });
        } else {
            setButtons({ good, retry, bad });
        }
    }

    function evaluateSaveAsk(mark) {
        // evaluate
        console.log('mark:', mark);
        const changes = evaluate(card, mark);

        const retry = mark === marks.RETRY;

        // save
        dispatch(updateCard({ number: card.number, dbid: card.dbid, changes, retry }));

        // ask
        console.log('next!');
        setButtons({ neutral });

        dispatch(updateSession(retry && card.number));
    }

    function act(mark) {
        questionMode ? pronounceAndPrepareEvaluation() : evaluateSaveAsk(mark);

        setQuestionMode(!questionMode);
    }

    return (
        <>
        <button className="speaker" onClick={() => speak()}>🔊</button>
        <div className="nav-buttons">
            {learningPronunciation ? '' : (<>
                <button className={buttons.good} onClick={() => act(marks.GOOD)} />
                <button className={buttons.neutral} onClick={() => act(marks.PASS)} />
                <button className={buttons.retry} onClick={() => act(marks.RETRY)} />
                <button className={buttons.bad} onClick={() => act(marks.BAD)} />
            </>)}
        </div>
        </>
    );
}