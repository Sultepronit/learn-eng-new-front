import { useEffect, useMemo, useState, useRef } from "react";
import TableRow from "./TableRow";
import { useSelector } from "react-redux";
import { changeSelectedCardId, getLastDisplayedId, getSelectedCardId, selectDisplayRange, setLastDisplayedId } from "./listSlice";
import { useDispatch } from "react-redux";

export default function Table({ cardIds }) {
    const dispatch = useDispatch();
    const tableRef = useRef(null);

    const rowNumber = 22;

    // const [lastRow, setLastRow] = useState(0);
    const lastRow = useSelector(getLastDisplayedId);
    function setLastRow(value) {
        dispatch(setLastDisplayedId(value))
    }

    const displayRange = useSelector(selectDisplayRange);

    const selectedCardId = useSelector(getSelectedCardId);

    function handleScroll(e) {
        setLastRow(Math.round(lastRow + e.deltaY / 16))
    }

    function handleKeyUp(e) {
        console.log(e.key)
        switch(e.key) {
            case 'ArrowUp':
                dispatch(changeSelectedCardId(1));
                break;
            case 'ArrowDown':
                dispatch(changeSelectedCardId(-1));
                break;
            case 'PageUp':
                setLastRow(lastRow - 100);
                break;
            case 'PageDown':
                setLastRow(lastRow + 100);
                break;
            case 'Home':
                setLastRow(rowNumber);
                break;
            case 'End':
                setLastRow(cardIds.length);
                break;
        }
    }

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

    // const displayRange = useMemo(() => {

    //     const result = cardIds.slice(lastRow - rowNumber, lastRow);
    //     console.log(result);
    //     return result;
    // }, [cardIds, lastRow]);

    return (
        <section
            className="table"
            ref={tableRef}
            tabIndex={-1}
            onWheel={handleScroll}
            // onKeyUp={handleKeyUp}
            onKeyDown={handleKeyUp}
            onMouseEnter={() => tableRef.current.focus()}
            // onMouseEnter={(e) => e.target.focus()} // the target can be child!
            // onMouseOver={() => tableRef.current.focus()}
            onMouseLeave={() => tableRef.current.blur()}
        >
            <div className="rows">
                {displayRange.map(cardId => (
                    <TableRow
                        key={cardId}
                        cardId={cardId}
                        isSelected={selectedCardId === cardId}
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
                onChange={(e) => setLastRow(Number(e.target.value))}
                onKeyDown={(e) => e.preventDefault()}
            />
        </section>
    );
}