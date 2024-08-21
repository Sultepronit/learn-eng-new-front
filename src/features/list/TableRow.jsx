import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { getSelectedCard, selectCard, selectCardById } from "./listSlice";
import { getSelectedCardId, selectCardById, setSelectedCardId } from "./listSlice";

// export default function TableRow({ card }) {
// export default function TableRow({ cardId }) {
const TableRow = React.memo(function TableRow({ cardId, isSelected }) {
    // console.log(isSelected);
    const dispatch = useDispatch();

    const card = useSelector(state => selectCardById(state, cardId));

    const classNames = 'table-row' + (isSelected ? ' selected' : '');

    const columns = {
        gridTemplateColumns:
            '3em 4em 1.5em 1.5em 1.5em 1.5em 4em 1.5em 1.5em 1.5em 1.5em 2fr 2fr 3fr 3fr'
    };

    return (
        <div
            className={classNames}
            style={columns}
            // onClick={() => select(card.id)}
            onClick={() => dispatch(setSelectedCardId(card.id))}
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
});

export default TableRow;