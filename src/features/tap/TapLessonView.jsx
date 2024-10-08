import './tapStyle.css';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSession } from "./tapThunks";
import { getVersion } from "../../services/versionHandlers";
import { getNextCard, selectSession, selectStages } from "./tapSlice";
import CardView from './CardView';
import NavButtons from './NavButtons';

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
        setCard(dispatch(getNextCard()));
        console.log(session);
        console.log(card);
    }, [session]);

    // console.log(card);

    return !stages ? '' : (
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