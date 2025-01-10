import { useEffect, useState } from "react";
import { speak } from "../pronunciation/pronunciation";
import { directions, marks } from "./statuses";
import { useDispatch } from "react-redux";
import { updateSession } from "./writeSlice";

export default function KeyboardControls({
    card,
    questionMode,
    setQuestionMode,
    stage,
    setStage,
    mark,
    setMark,
    retryMode
}) {
    const dispatch = useDispatch();
    const [keyPressed, setKeyPressed] = useState('_');
    const [pressCount, setPressCount] = useState(0);

    const [question, evaluation, training] = ['question', 'evaluation', 'training'];

    function increment() {
        setPressCount((prev) => prev + 1);
        console.log(pressCount);
    }

    useEffect(() => {
        const handleKeyPress = (e) => {
            // console.log(e);
            setKeyPressed(e.key === ' ' ? 'Space' : e.key);
            // setPressCount((prev) => prev + 1);
            // setPressCount(pressCount + 1);
            increment();
            if (e.key === 'Alt') speak();
            // console.log(e.key);
        };

        document.addEventListener('keyup', handleKeyPress);

        return () => document.removeEventListener('keydown', handleKeyPress)
    }, []);

    console.log(pressCount);

    function finishIt() {
        console.log('We did it!');
        dispatch(updateSession());
    }

    useEffect(() => {
        // console.log('action!');
        // console.log(questionMode, stage);
        if (keyPressed === 'Enter') {  
            console.log(stage);   
            if (questionMode) {
                setQuestionMode(false);
            }
            if (stage === question) {
                setStage(evaluation);
                console.log(stage);
            } else if (stage === evaluation && mark) {
                console.log(mark);
                if (card.direction === directions.BACKWARD && mark === marks.GOOD) { // no training
                    finishIt();
                } else { // training
                    setStage(training);
                    console.log(stage);
                }
            } else if (stage === training) {
                finishIt();
            }
        } else if (stage === evaluation) {
            // console.log('here we go')
            if (keyPressed.toLowerCase() === 'g') {
                console.log(marks.GOOD);
                setMark(marks.GOOD)
            }
        }
        // console.log(stage);

    }, [keyPressed, pressCount]);

    return (
        <p>{keyPressed}</p>
    )
}