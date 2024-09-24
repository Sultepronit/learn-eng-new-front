import { useRef } from "react";
import { useSelector } from "react-redux";
import { selectDisplayedList } from "./listSlice";

import TableScroller from "./TableScroller";
import TableBody from "./TableBody";

export default function Table({ firstRow, setFirstRowWithCaution, lastPossibleRow, rowNumber }) {
    const displayedList = useSelector(selectDisplayedList);
    const tableRef = useRef(null);

    function handleScroll(e) {
        setFirstRowWithCaution(firstRow + e.deltaY / 16)
    }

    function handleKeyUp(e) {
        switch(e.key) {
            case 'ArrowUp':
                setFirstRowWithCaution(firstRow - 1);
                break;
            case 'ArrowDown':
                setFirstRowWithCaution(firstRow + 1);
                break;
            case 'PageUp':
                setFirstRowWithCaution(firstRow - 100);
                break;
            case 'PageDown':
                setFirstRowWithCaution(firstRow + 100);
                break;
            case 'Home':
                setFirstRowWithCaution(0);
                break;
            case 'End':
                setFirstRowWithCaution(lastPossibleRow);
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
                displayedList={displayedList}
            />
            <TableScroller
                displayedRows={rowNumber}
                allRows={lastPossibleRow}
                value={firstRow}
                setValue={setFirstRowWithCaution}
            />
        </section>
    );
}