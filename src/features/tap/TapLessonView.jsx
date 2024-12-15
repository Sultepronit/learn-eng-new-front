import './tapStyle.css';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSession } from "./tapThunks";
import { getVersion } from "../../services/versionHandlers";
import { getNextCard, removeReset, selectCurrentCard, selectResetIsActual, selectSession, selectProgress, selectStages } from "./tapSlice";
import CardView from './CardView';
import NavButtons from './NavButtons';
import { prepareSpeech } from '../pronunciation/pronunciation';
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

    // const [card, setCard] = useState();
    const [questionMode, setQuestionMode] = useState(true);

    useEffect(() => {
        dispatch(getSession(getVersion()));
    }, [dispatch]);

    useEffect(() => {
        console.log(session);
        if (!session) return;

        backupSession(session);

        dispatch(getNextCard());
    }, [dispatch, session]);

    useEffect(() => {
        console.log(card);
        if (!card) return;
        prepareSpeech([card.word]);
    }, [card]);

    const handleGlobalClick = resetIsActual ? () => dispatch(removeReset()) : null;

    // return !stages || !card ? '' : (
    return !card ? '' : (
        <section className="tap-view" onClick={handleGlobalClick}>
            {/* <div>
                <p>{stages.learn}</p>
            </div> */}
            <StatsView
                progress={progress}
                stages={stages}
            />

            <CardView
                card={card}
                questionMode={questionMode}
            />

            <ResetButton resetIsActual={resetIsActual} />

            <NavButtons
                card={card}
                questionMode={questionMode}
                setQuestionMode={setQuestionMode}
            />
        </section>
    );
}