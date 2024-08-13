import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEditedCard, selectCard } from "./listSlice";

export default function TableRow({ card }) {
    const dispatch = useDispatch();

    function select(card) {
        console.log(card.main.number);
        // console.log(card);
        dispatch(selectCard(card));
    }

    const editedCard = useSelector(getEditedCard);

    const classNames = useMemo(() => {
        return 'table-row' + (editedCard.main?.number === card.main.number ? ' selected' : '');
    }, [editedCard, card]);

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
            <p className="cell">{card.main.number}</p>

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

            <p className="cell eng">{card.main.word}</p>
            <p className="cell">{card.main.transcription}</p>
            <p className="cell">{card.main.translation}</p>
            <p className="cell">{card.main.example}</p>
        </div>
    );
}