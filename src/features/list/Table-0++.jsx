// import { useState } from "react";
import { useEffect, useMemo, useState } from "react";
import TableRow from "./TableRow";

export default function Table({ data, cardIds }) {
    const rowNumber = 25;

    const [lastRow, setLastRow] = useState(0);

    useEffect(() => {
        setLastRow(data.length);

        const calculated = rowNumber / data.length * 550;
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
    }, [data.length]);

    function changeLastRow(value) {
        console.log(value);
        setLastRow(value);
    }

    const displayRange = useMemo(() => {

        const result = data.slice(lastRow - rowNumber, lastRow);
        console.log(result);
        return result;
    }, [data, lastRow]);

    return (
        <section className="table">
            <div className="rows">
            {/* {displayRange.map(card => (
                <TableRow
                    key={card.id}
                    card={card}
                />
            ))} */}
            {displayRange.map(card => (
                <TableRow
                    key={card.id}
                    // card={card}
                    cardId={card.id}
                />
            ))}
            </div>
            <input
                type="range"
                className="scroller"
                name="scroller"
                min={rowNumber}
                max={data.length}
                value={lastRow}
                onChange={(e) => changeLastRow(e.target.value)}
            />
        </section>
    );
}