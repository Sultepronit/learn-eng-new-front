import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCardNumber } from "./listSlice";
import { selectCardByNumber } from "../cards/cardsSlice";

const TableRow = React.memo(function TableRow({ cardNumber, isSelected }) {
    const dispatch = useDispatch();

    const card = useSelector(state => selectCardByNumber(state, cardNumber));
    // console.log(cardNumber);
    // console.log(card);

    const classNames = 'table-row' + (isSelected ? ' selected' : '');

    const columns = {
        gridTemplateColumns:
            '3em 4em 1.5em 1.5em 1.5em 1.5em 4em 1.5em 1.5em 1.5em 1.5em 2fr 2fr 3fr 3fr'
    };

    return (
        <div
            className={'table-row' + (isSelected ? ' selected' : '') + (card.dbid < 1 ? ' empty-card' : '')}
            style={columns}
            onClick={() => dispatch(setSelectedCardNumber(card.number))}
        >
            <p className="cell text-right">{card.number}</p>

            <p className="cell text-right">{card.repeatStatus}</p>
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