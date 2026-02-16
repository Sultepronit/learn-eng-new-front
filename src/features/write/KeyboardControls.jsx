import { useEffect, useState } from "react";
// import { speak } from "../pronunciation/pronunciation";
import { directions, marks } from "./statuses";
import { useDispatch } from "react-redux";
// import { updateSession } from "./writeSlice";
import evaluate from "./evaluation";
import { updateCard } from "./writeThunks";
import { speakNewly } from "../pronunciation/speakThunks";

export default function KeyboardControls({
    card,
    stage,
    setStage,
    mark,
    setMark,
    correctSpelling,
    retryMode
}) {
    const dispatch = useDispatch();
    const [keyPressed, setKeyPressed] = useState('_');
    const [pressCount, setPressCount] = useState(0);

    const [question, evaluation, training] = ['question', 'evaluation', 'training'];

    useEffect(() => {
        const handleKeyPress = (e) => {
            setKeyPressed(e.key === ' ' ? 'Space' : e.key);
            setPressCount((prev) => prev + 1);
        };

        document.addEventListener('keyup', handleKeyPress);

        return () => document.removeEventListener('keydown', handleKeyPress)
    }, []);

    // function evaluateSaveAsk() {
    function evaluateAndSave() {
        // evaluate
        console.log('mark:', mark);
        const changes = evaluate(card, mark);

        // save
        const retry = mark === marks.RETRY;
        dispatch(updateCard({ number: card.number, dbid: card.dbid, changes, retry }));
    }

    useEffect(() => {
        // console.log('action!');
        if (keyPressed === 'Enter') {  
            console.log(stage);   
            if (stage === question) {
                setStage(evaluation);
                // speak();
                dispatch(speakNewly());
            } else if (stage === evaluation && mark) {
                evaluateAndSave();

                if (card.direction === directions.BACKWARD && mark === marks.GOOD) { // no training
                    setStage('question');
                } else { // training
                    setStage(training);
                }
            } else if (stage === training && correctSpelling) {
                setStage('question');
            }
        } else if (keyPressed === 'Alt') {
            // speak();
            dispatch(speakNewly());
        } else if (stage === evaluation) {
            const key = keyPressed.toLowerCase();
            if (key === 'g') {
                retryMode ? setMark(marks.PASS) : setMark(marks.GOOD);
            } else if (key === 'n') {
                setMark(marks.RETRY);
            } else if (key === 'b') {
                setMark(marks.BAD);
            }
        }
    }, [keyPressed, pressCount]);

    return (
        <p>{keyPressed}</p>
    )
}