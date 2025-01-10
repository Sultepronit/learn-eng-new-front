import './writeStyle.css';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSession } from "./writeThunks";
import { getNextCard, selectCurrentCard, selectSession } from "./writeSlice";
import { prepareSpeech } from "../pronunciation/pronunciation";
import CardView from "./CardView";
import KeyboardControls from "./KeyboardControls";
import TheInput from "./TheInput";
import { directions } from './statuses';
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

    const [questionMode, setQuestionMode] = useState(true);
    const [stage, setStage] = useState('');
    const [mark, setMark] = useState(null);
    const [correctSpelling, setCorrectSpelling] = useState(false);
    console.log(stage);

    useEffect(() => {
        dispatch(getSession());
    }, [dispatch]);

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

        setStage('question');
        prepareSpeech(card.word.toPlay ? card.word.toPlay : [card.word]);
    }, [card]);

    // const handleGlobalClick = resetIsActual ? () => dispatch(removeReset()) : null;

    const inputIsActive = stage === 'training'
        || (stage === 'question' && card?.direction === directions.BACKWARD);
    console.log(inputIsActive);

    return !card ? (<h1>Loading...</h1>) : (
        <section>
            {/* <StatsView
                progress={progress}
                stages={stages}
                cardsPassed={progress.sessionLength - session.length}
            /> */}

            {session.length < 1 ? (<h1>Happy End!</h1>) : (
                <>
                    <KeyboardControls
                        card={card}
                        questionMode={questionMode}
                        setQuestionMode={setQuestionMode}
                        stage={stage}
                        setStage={setStage}
                        mark={mark}
                        setMark={setMark}
                    />

                    {/* <TheInput
                        expectedValue={card.word}
                    /> */}

                    <CardView
                        card={card}
                        // questionMode={questionMode}
                        questionMode={stage === 'question'}
                    // />
                    >
                        <TheInput
                            expectedValue={card.word}
                            // isDisabled={true}
                            isActive={inputIsActive}
                            correctSpelling={correctSpelling}
                            setCorrectSpelling={setCorrectSpelling}
                        />
                    </CardView>
                </>
            )}
        </section>
    );
}