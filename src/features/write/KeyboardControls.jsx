import { useEffect, useState } from "react";
import { speak } from "../pronunciation/pronunciation";
import { directions, marks } from "./statuses";
import { useDispatch } from "react-redux";
import { updateSession } from "./writeSlice";

export default function KeyboardControls({
    card,
    stage,
    setStage,
    mark,
    setMark,
    correctSpelling,
    retryMode
}) {
    // const dispatch = useDispatch();
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


    function finishIt() {
        setStage('question');
    }

    useEffect(() => {
        // console.log('action!');
        if (keyPressed === 'Enter') {  
            console.log(stage);   
            if (stage === question) {
                setStage(evaluation);
                speak();
            } else if (stage === evaluation && mark) {
                console.log(mark);
                if (card.direction === directions.BACKWARD && mark === marks.GOOD) { // no training
                    finishIt();
                } else { // training
                    setStage(training);
                }
            } else if (stage === training) {
                if (correctSpelling) finishIt();
            }
        } else if (stage === evaluation) {
            const key = keyPressed.toLowerCase();
            if (key === 'g') {
                setMark(marks.GOOD)
            } else if (key === 'n') {
                setMark(marks.RETRY)
            } else if (key === 'b') {
                setMark(marks.BAD)
            }
        } else if (keyPressed === 'Alt') {
            speak();
        }
    }, [keyPressed, pressCount]);

    return (
        <p>{keyPressed}</p>
    )
}