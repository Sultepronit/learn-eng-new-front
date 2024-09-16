import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCardById } from "../cards/cardsSlice";
import { setSelectedCard } from "./listSlice";

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
            // onClick={() => dispatch(setSelectedCardId(card.id))}
            onClick={() => dispatch(setSelectedCard(card))}
        >
            <p className="cell text-right">{card.id}</p>

            <p className="cell text-right">{card.tapStatus}</p>
            <p className="cell text-center">{card.tapFProgress}</p>
            <p className="cell text-center">{card.tapBProgress}</p>
            <p className={`cell text-center ${card.tapFAutorepeat ? 'autorepeat' : ''}`}>
                {card.tapFRecord}
            </p>
            <p className={`cell text-center ${card.tapBAutorepeat ? 'autorepeat' : ''}`}>
                {card.tapBRecord}
            </p>

            <p className="cell text-right">{card.writeStatus}</p>
            <p className="cell text-center">{card.writeFProgress}</p>
            <p className="cell text-center">{card.writeBProgress}</p>
            <p className={`cell text-center ${card.writeFAutorepeat ? 'autorepeat' : ''}`}>
                {card.writeFRecord}
            </p>
            <p className={`cell text-center ${card.writeBAutorepeat ? 'autorepeat' : ''}`}>
                {card.writeBRecord}
            </p>

            <p className="cell" title={card.word}>{card.word}</p>
            <p className="cell" title={card.transcription}>{card.transcription}</p>
            <p className="cell" title={card.translation}>{card.translation}</p>
            <p className="cell" title={card.example}>{card.example}</p>
        </div>
    );
});

export default TableRow;