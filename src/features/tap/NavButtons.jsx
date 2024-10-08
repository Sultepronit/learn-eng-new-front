import { useDispatch } from "react-redux";
import { rearrangeSession, updateSession } from "./tapSlice";
import { useEffect, useState } from "react";
import { directions, marks, stages } from "./statuses";
import evaluate from "./evaluate";

export default function NavButtons({ card, questionMode, setQuestionMode }) {
    const dispatch = useDispatch();

    const [good, neutral, retry, bad] = ['good', 'neutral', 'retry', 'bad'];
    const [buttons, setButtons] = useState({ neutral });

    function prepareEvaluation() {
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
        
        const mutatedCard = { ...card, mark };
        const changes = evaluate(mutatedCard);
        console.log(changes);
        console.log(mutatedCard);

        ask();
    }

    function ask(returnedCard) {
        console.log('next!');
        setButtons({ neutral });
        // dispatch(rearrangeSession());
        dispatch(updateSession(returnedCard));
    }

    function act(mark) {
        questionMode ? prepareEvaluation() : evaluateSaveAsk(mark);

        setQuestionMode(!questionMode);
    }


    return (
        <div className="nav-buttons">
            <button className={buttons.good} onClick={() => act(marks.GOOD)} />
            <button className={buttons.neutral} onClick={() => act(marks.PASS)} />
            <button className={buttons.retry} onClick={() => act(marks.RETRY)} />
            <button className={buttons.bad} onClick={() => act(marks.BAD)} />
        </div>
    );
}