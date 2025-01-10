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

    const [question, evaluation, training] = ['question', 'evaluation', 'training']

    useEffect(() => {
        const handleKeyPress = (e) => {
            // console.log(e);
            setKeyPressed(e.key === ' ' ? 'Space' : e.key);
            if (e.key === 'Alt') speak();
        };

        document.addEventListener('keyup', handleKeyPress);

        return () => document.removeEventListener('keydown', handleKeyPress)
    }, []);
    // }, [card]);

    useEffect(() => {
        // console.log('action!');
        // console.log(questionMode, stage);
        if (keyPressed === 'Alt') {
            // speak();
        } else if (keyPressed === 'Enter') {
            // console.log('Enter!');
            // console.log(stage);
            
            if (questionMode) {
                setQuestionMode(false);
            }
            if (stage === question) {
                setStage(evaluation);
                console.log(stage);
            } else if (stage === evaluation && mark) {
                console.log(mark);
                if (card.direction === directions.BACKWARD && mark === marks.GOOD) { // no training
                    console.log('Next!');
                } else { // training
                    setStage(training);
                    console.log(stage);
                }
            } else if (stage === training) {
                dispatch(updateSession());
            }
        } else if (stage === evaluation) {
            // console.log('here we go')
            if (keyPressed.toLowerCase() === 'g') {
                console.log(marks.GOOD);
                setMark(marks.GOOD)
            }
        }
        // console.log(stage);

    }, [keyPressed]);

    return (
        <p>{keyPressed}</p>
    )
}