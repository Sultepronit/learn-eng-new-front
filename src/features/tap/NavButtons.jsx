import { useDispatch } from "react-redux";
import { updateSession } from "./tapSlice";
import { useState } from "react";
import { directions, marks, stages } from "./statuses";
import evaluate from "./evaluation";
import { updateCard } from "./tapThunks";
// import { speak } from "../pronunciation/pronunciation";
import setPause from "../../helpers/setPause";
import PronTap from "../pronunciation/PronTap";
import { speakNewly } from "../pronunciation/speakThunks";

export default function NavButtons({ card, questionMode, setQuestionMode, retryMode }) {
    const dispatch = useDispatch();

    const [good, pass, retry, bad] = ['good', 'pass', 'retry', 'bad'];
    const [buttons, setButtons] = useState({ pass });

    const [learningPronunciation, setLearningPronunciation] = useState(false);

    function pronounceAndPrepareEvaluation() {
        if (card.direction === directions.FORWARD) setLearningPronunciation(true);
        Promise.any([
            // speak(),
            dispatch(speakNewly()).unwrap(),
            setPause(2000) // clean the timer!
        ]).then(() => setLearningPronunciation(false));

        const notBadButtons = retryMode ? { pass, retry } : { good, retry };
        /*if (card.repeatStage === stages.CONFIRM) {
            setButtons({ good, pass, bad });
        } else*/
        // if (card.repeatStage === stages.LEARN && card.direction === directions.FORWARD) {
        //     setButtons({ ...notBadButtons });
        // } else {
        //     setButtons({ ...notBadButtons, bad });
        // }
        // this is stupid, so must be changed!!!
        setButtons({ ...notBadButtons, bad });

        // setButtons({ ...buttons)
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
        setButtons({ pass });

        dispatch(updateSession(retry && card.number));
    }

    function act(mark) {
        questionMode ? pronounceAndPrepareEvaluation() : evaluateSaveAsk(mark);

        setQuestionMode(!questionMode); // change question mode to answer and back
    }

    return (
        <>
        {/* <button className="speaker" onClick={() => speak()}>🔊</button> */}
        <PronTap />
        <div className="nav-buttons">
            {learningPronunciation ? '' : (<>
                <button className={buttons.good} onClick={() => act(marks.GOOD)} />
                <button className={buttons.pass} onClick={() => act(marks.PASS)} />
                <button className={buttons.retry} onClick={() => act(marks.RETRY)} />
                <button className={buttons.bad} onClick={() => act(marks.BAD)} />
            </>)}
        </div>
        </>
    );
}