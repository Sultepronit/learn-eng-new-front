import { useRef } from "react";
import { useDispatch } from "react-redux";
import TableScroller from "./TableScroller";
import TableBody from "./TableBody";

export default function Table({ displayRange, rowNumber, lastRow, setLastRow, lastPossibleRow }) {
    // const dispatch = useDispatch();

    const tableRef = useRef(null);

    function handleScroll(e) {
        setLastRow(lastRow + e.deltaY / 16)
    }

    function handleKeyUp(e) {
        // console.log(e.key)
        switch(e.key) {
            case 'ArrowUp':
                setLastRow(lastRow - 1);
                break;
            case 'ArrowDown':
                setLastRow(lastRow + 1);
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
                setLastRow(lastPossibleRow);
                break;
        }
    }

    return (
        <section
            className="table"
            ref={tableRef}
            tabIndex={-1}
            onWheel={handleScroll}
            onKeyDown={handleKeyUp}
            onMouseEnter={() => tableRef.current.focus()}
            onMouseLeave={() => tableRef.current.blur()}
        >
            <TableBody
                displayRange={displayRange}
            />
            <TableScroller
                displayedRows={rowNumber}
                allRows={lastPossibleRow}
                value={lastRow}
                setValue={setLastRow}
            />
        </section>
    );
}