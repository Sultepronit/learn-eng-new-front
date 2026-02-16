import './writeStyle.css';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSession } from "./writeThunks";
import { getNextCard, selectCurrentCard, selectProgress, selectSession, selectSessionLength, updateSession } from "./writeSlice";
// import { prepareSpeech } from "../pronunciation/pronunciation";
import CardView from "./CardView";
import KeyboardControls from "./KeyboardControls";
import TheInput from "./TheInput";
import { directions, marks } from './statuses';
import StatsView from './StatsView';
import PronListView from '../pronunciation/PronListView';

export default function WriteSessionView() {
    const dispatch = useDispatch();
    
    const session = useSelector(selectSession);
    // const resetIsActual = useSelector(selectResetIsActual);
    const card = useSelector(selectCurrentCard);
    const progress = useSelector(selectProgress);
    const sessionLength = useSelector(selectSessionLength);

    const [stage, setStage] = useState('question');
    const [mark, setMark] = useState(null);
    const [correctSpelling, setCorrectSpelling] = useState(false);

    const retryMode = progress.tries >= sessionLength;
    // console.log(stage);

    useEffect(() => {
        dispatch(getSession());
    }, [dispatch]);

    useEffect(() => {
        if (!session) return;
        if (stage === 'question') {
            console.log('new question!');
            dispatch(updateSession(mark === marks.RETRY && card.number));
        }
    }, [stage]);

    useEffect(() => {
        console.log(session);
        if (!session) return;

        if (session.length < 1) return;

        dispatch(getNextCard());

        setMark(null);
    }, [dispatch, session]);

    // useEffect(() => {
    //     console.log(card);
    //     if (!card) return;

    //     prepareSpeech(card.word.toPlay ? card.word.toPlay : [card.word]);
    // }, [card]);

    useEffect(() => {
        if (stage === 'evaluation' && card?.direction === directions.BACKWARD) {
            if (correctSpelling) {
                retryMode ? setMark(marks.PASS) : setMark(marks.GOOD)
            } else {
                setMark(marks.RETRY)
            }
        }
    }, [stage, card, correctSpelling])

    const inputIsActive = stage === 'training'
        || (stage === 'question' && card?.direction === directions.BACKWARD);

    return !card ? (<h1>Loading...</h1>) : (
        <section className="write-session">
            <KeyboardControls
                card={card}
                stage={stage}
                setStage={setStage}
                mark={mark}
                setMark={setMark}
                correctSpelling={correctSpelling}
                retryMode={retryMode}
            />
            <StatsView
                progress={progress}
                cardsPassed={sessionLength - session.length}
                sessionLength={sessionLength}
            />

            {session.length < 1 ? (<h1>Happy End!</h1>) : (
                <>
                    <TheInput
                        expectedValue={typeof card.word === 'string' ? card.word : card.word.questionF}
                        isActive={inputIsActive}
                        stage={stage}
                        correctSpelling={correctSpelling}
                        setCorrectSpelling={setCorrectSpelling}
                    />

                    <CardView
                        card={card}
                        questionMode={stage === 'question'}
                        mark={mark}
                    />
                    <div className="pron-list">
                        <PronListView />
                    </div>
                </>
            )}
        </section>
    );
}