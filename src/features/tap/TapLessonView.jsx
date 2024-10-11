import './tapStyle.css';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSession } from "./tapThunks";
import { getVersion } from "../../services/versionHandlers";
import { getNextCard, selectSession, selectStages } from "./tapSlice";
import CardView from './CardView';
import NavButtons from './NavButtons';
import { getRecords } from '../pronunciation/audioSources';
import { prepareSpeech } from '../pronunciation/pronunciation';

export default function TapLessonView() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSession(getVersion()));
    }, [dispatch]);
    
    const stages = useSelector(selectStages);
    const session = useSelector(selectSession);

    const [card, setCard] = useState();
    const [questionMode, setQuestionMode] = useState(true);

    useEffect(() => {
        if (!stages) return;
        const nextCard = dispatch(getNextCard());
        console.log(nextCard);

        // getRecords(nextCard.word);
        prepareSpeech([nextCard.word]);

        setCard(nextCard);

        console.log(session);
    }, [session]);

    // console.log(card);

    return !stages || !card ? '' : (
        <section className="tap-view">
            <div>
                <p>{stages.learn}</p>
            </div>

            <CardView
                card={card}
                questionMode={questionMode}
            />

            <NavButtons
                card={card}
                questionMode={questionMode}
                setQuestionMode={setQuestionMode}
            />
        </section>
    );
}