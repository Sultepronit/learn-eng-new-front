import './tapStyle.css';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSession } from "./tapThunks";
import { getVersion } from "../../services/versionHandlers";
import { getNextCard, removeReset, selectCurrentCard, selectResetIsActual, selectSession, selectProgress, selectStages } from "./tapSlice";
import CardView from './CardView';
import NavButtons from './NavButtons';
// import { prepareSpeech } from '../pronunciation/pronunciation';
import ResetButton from './ResetButton';
import { backupSession } from './sessionBackup';
import StatsView from './StatsView';

export default function TapLessonView() {
    const dispatch = useDispatch();
    
    const session = useSelector(selectSession);
    const resetIsActual = useSelector(selectResetIsActual);
    const card = useSelector(selectCurrentCard);
    const progress = useSelector(selectProgress);
    const stages = useSelector(selectStages); // maybe not in here...

    const [questionMode, setQuestionMode] = useState(true);

    useEffect(() => {
        dispatch(getSession(getVersion()));
    }, [dispatch]);

    useEffect(() => {
        console.log(session);
        if (!session) return;

        backupSession(session, progress);

        if (session.length < 1) return;

        dispatch(getNextCard());
    }, [dispatch, session]);

    // useEffect(() => {
    //     console.log(card);
    //     // if (!card) return;
    //     // prepareSpeech(card.word.toPlay ? card.word.toPlay : [card.word]);
    // }, [card]);

    const handleGlobalClick = resetIsActual ? () => dispatch(removeReset()) : null;

    // return !card ? '' : (
    return !card ? (<h1>Loading...</h1>) : (
        <section className="tap-view" onClick={handleGlobalClick}>
            <StatsView
                progress={progress}
                stages={stages}
                cardsPassed={progress.sessionLength - session.length}
            />

            {session.length < 1 ? (<h1>Happy End!</h1>) : (
                <>
                    <CardView
                        card={card}
                        questionMode={questionMode}
                    />

                    <ResetButton resetIsActual={resetIsActual} />

                    <NavButtons
                        card={card}
                        questionMode={questionMode}
                        setQuestionMode={setQuestionMode}
                        retryMode={progress.tries >= progress.sessionLength}
                    />
                </>
            )}
        </section>
    );
}