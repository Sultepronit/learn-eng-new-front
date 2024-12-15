import './tapStyle.css';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSession } from "./tapThunks";
import { getVersion } from "../../services/versionHandlers";
import { getNextCard, removeReset, selectCurrentCard, selectResetIsActual, selectSession, selectStages } from "./tapSlice";
import CardView from './CardView';
import NavButtons from './NavButtons';
import { prepareSpeech } from '../pronunciation/pronunciation';
import ResetButton from './ResetButton';
import { backupSession } from './sessionBackup';

export default function TapLessonView() {
    const dispatch = useDispatch();
    
    const stages = useSelector(selectStages);
    const session = useSelector(selectSession);
    const resetIsActual = useSelector(selectResetIsActual);
    const card = useSelector(selectCurrentCard);

    // const [card, setCard] = useState();
    const [questionMode, setQuestionMode] = useState(true);

    useEffect(() => {
        dispatch(getSession(getVersion()));
    }, [dispatch]);

    useEffect(() => {
        if (!session) return;

        backupSession(session);

        // const nextCard = dispatch(getNextCard());
        // console.log(nextCard);
        // prepareSpeech([nextCard.word]);
        // setCard(nextCard);

        dispatch(getNextCard());
        // console.log(card);
        // prepareSpeech([card.word]);

        console.log(session);
    }, [dispatch, session]);

    useEffect(() => {
        console.log(card);
        prepareSpeech([card.word]);
    }, [card]);

    // console.log(card);

    const handleGlobalClick = resetIsActual ? () => dispatch(removeReset()) : null;

    return !stages || !card ? '' : (
        <section className="tap-view" onClick={handleGlobalClick}>
            <div>
                <p>{stages.learn}</p>
            </div>

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