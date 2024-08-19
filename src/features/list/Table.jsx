// import { useState } from "react";
import { useEffect, useMemo, useState } from "react";
import TableRow from "./TableRow";

export default function Table({ cardIds }) {
    const rowNumber = 22;

    const [lastRow, setLastRow] = useState(0);

    useEffect(() => {
        setLastRow(cardIds.length);

        const calculated = rowNumber / cardIds.length * 550;
        const thumbHeight = calculated >= 20 ? calculated : 20;
        const style = document.createElement('style');
        style.innerHTML = `
        .scroller::-webkit-slider-thumb {
            height: ${thumbHeight}px;
        }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        }
    }, [cardIds.length]);

    function changeLastRow(value) {
        console.log(value);
        setLastRow(value);
    }

    const displayRange = useMemo(() => {

        const result = cardIds.slice(lastRow - rowNumber, lastRow);
        console.log(result);
        return result;
    }, [cardIds, lastRow]);

    return (
        <section className="table">
            <div className="rows">
            {displayRange.map(cardId => (
                <TableRow
                    key={cardId}
                    cardId={cardId}
                />
            ))}
            </div>
            <input
                type="range"
                className="scroller"
                name="scroller"
                min={rowNumber}
                max={cardIds.length}
                value={lastRow}
                onChange={(e) => changeLastRow(e.target.value)}
            />
        </section>
    );
}