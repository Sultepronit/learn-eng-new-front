import './writeStyle.css';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSession } from "./writeThunks";
import { getNextCard, selectCurrentCard, selectSession, updateSession } from "./writeSlice";
import { prepareSpeech } from "../pronunciation/pronunciation";
import CardView from "./CardView";
import KeyboardControls from "./KeyboardControls";
import TheInput from "./TheInput";
import { directions, marks } from './statuses';
// import { getVersion } from "../../services/versionHandlers";
// import { getNextCard, removeReset, selectCurrentCard, selectResetIsActual, selectSession, selectProgress, selectStages } from "./tapSlice";
// import CardView from './CardView';
// import NavButtons from './NavButtons';
// import { prepareSpeech } from '../pronunciation/pronunciation';
// import ResetButton from './ResetButton';
// import { backupSession } from './sessionBackup';
// import StatsView from './StatsView';

export default function WriteSessionView() {
    const dispatch = useDispatch();
    
    const session = useSelector(selectSession);
    // const resetIsActual = useSelector(selectResetIsActual);
    const card = useSelector(selectCurrentCard);
    // const progress = useSelector(selectProgress);

    const [stage, setStage] = useState('question');
    const [mark, setMark] = useState(null);
    const [correctSpelling, setCorrectSpelling] = useState(false);
    // console.log(stage);

    useEffect(() => {
        dispatch(getSession());
    }, [dispatch]);

    useEffect(() => {
        if (stage === 'question') {
            console.log('new question!');
            try {
                dispatch(updateSession());
            } catch (error) {
                console.log(error.message)
            }
        }
    }, [stage]);

    useEffect(() => {
        console.log(session);
        if (!session) return;

        // backupSession(session, progress);

        if (session.length < 1) return;

        dispatch(getNextCard());

        setMark(null);
    }, [dispatch, session]);

    useEffect(() => {
        console.log(card);
        if (!card) return;

        prepareSpeech(card.word.toPlay ? card.word.toPlay : [card.word]);
    }, [card]);

    useEffect(() => {
        if (stage === 'evaluation' && card?.direction === directions.BACKWARD) {
            if (correctSpelling) {
                setMark(marks.GOOD)
            } else {
                setMark(marks.RETRY)
            }
        }
    }, [stage, card, correctSpelling])

    const inputIsActive = stage === 'training'
        || (stage === 'question' && card?.direction === directions.BACKWARD);

    return !card ? (<h1>Loading...</h1>) : (
        <section className="write-session">
            {/* <StatsView
                progress={progress}
                stages={stages}
                cardsPassed={progress.sessionLength - session.length}
            /> */}

            {session.length < 1 ? (<h1>Happy End!</h1>) : (
                <>
                    <KeyboardControls
                        card={card}
                        stage={stage}
                        setStage={setStage}
                        mark={mark}
                        setMark={setMark}
                        correctSpelling={correctSpelling}
                    />

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
                    // />
                    >
                        {/* <TheInput
                            expectedValue={card.word}
                            // isDisabled={true}
                            isActive={inputIsActive}
                            correctSpelling={correctSpelling}
                            setCorrectSpelling={setCorrectSpelling}
                        /> */}
                    </CardView>
                </>
            )}
        </section>
    );
}