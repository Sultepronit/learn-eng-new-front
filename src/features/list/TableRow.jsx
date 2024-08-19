import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSelectedCard, selectCard, selectCardById } from "./listSlice";

// export default function TableRow({ card }) {
export default function TableRow({ cardId }) {
    const card = useSelector(state => selectCardById(state, cardId));
    const dispatch = useDispatch();

    function select(card) {
        // console.log(card.index);
        // console.log(card);
        dispatch(selectCard(card));
    }

    const selectedCard = useSelector(getSelectedCard);

    const classNames = useMemo(() => {
        return 'table-row' + (selectedCard?.id === card.id ? ' selected' : '');
    }, [selectedCard, card]);

    const columns = {
        gridTemplateColumns:
            '3em 4em 1.5em 1.5em 1.5em 1.5em 4em 1.5em 1.5em 1.5em 1.5em 2fr 2fr 3fr 3fr'
    };

    return (
        <div
            className={classNames}
            style={columns}
            onClick={() => select(card)}
        >
            {/* <p className="cell">{card.main.id}</p> */}
            <p className="cell">{card.id}</p>

            <p className="cell tap-stats">{card.tapStats.repeatStatus}</p>
            <p className="cell">{card.tapStats.forward.progress}</p>
            <p className="cell">{card.tapStats.backward.progress}</p>
            <p className={`cell ${card.tapStats.forward.autorepeat ? 'autorepeat' : ''}`}>
                {card.tapStats.forward.record}
            </p>
            <p className={`cell ${card.tapStats.backward.autorepeat ? 'autorepeat' : ''}`}>
                {card.tapStats.backward.record}
            </p>

            <p className="cell write-stats">{card.writeStats.repeatStatus}</p>
            <p className="cell">{card.writeStats.forward.progress}</p>
            <p className="cell">{card.writeStats.backward.progress}</p>
            <p className={`cell ${card.writeStats.forward.autorepeat ? 'autorepeat' : ''}`}>
                {card.writeStats.forward.record}
            </p>
            <p className={`cell ${card.writeStats.backward.autorepeat ? 'autorepeat' : ''}`}>
                {card.writeStats.backward.record}
            </p>

            <p className="cell eng">{card.word}</p>
            <p className="cell">{card.transcription}</p>
            <p className="cell">{card.translation}</p>
            <p className="cell">{card.example}</p>
        </div>
    );
}