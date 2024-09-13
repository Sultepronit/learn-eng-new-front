import './listStyle.css';
import { useState, useEffect, useMemo } from "react";
import Table from "./Table.jsx";
import { useDispatch, useSelector } from 'react-redux';
import CardEditor from './CardEditor.jsx';
import { fetchData, selectPreparedList, setSelectedCardId } from './listSlice.js';
import SearchBar from './SearchBar.jsx';
import checkIntLimits from '../../helpers/chekIntLimits.js';

export default function ListView() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchData());
    }, [dispatch]);

    const preparedList = useSelector(selectPreparedList);

    const rowNumber = 22;
    const [lastRow, setLastRow] = useState(0);

    function setLastRowWithCaution(value) {
        setLastRow(checkIntLimits(value, rowNumber, preparedList.length));
    }

    function setLastRowByCardId(cardId) {
        const theCardIndex = preparedList.findIndex(listCardId => listCardId === Number(cardId));
        if(theCardIndex < 0) return;
        setLastRowWithCaution(theCardIndex + rowNumber);
    }

    useEffect(() => {
        setLastRow(rowNumber);
        if(preparedList.length) {
            dispatch(setSelectedCardId(preparedList[0]));
        }
    }, [preparedList, dispatch]);

    const displayRange = useMemo(() => {
        const result = preparedList.slice(lastRow - rowNumber, lastRow);
        // console.log(result);
        return result;
    }, [preparedList, lastRow]);

    const template = (
        <section>
            <CardEditor />
            <button onClick={() => dispatch(fetchData())}>
                refresh
            </button>
            <SearchBar
                changeDisplayRange={setLastRowByCardId}
            />
            <Table
                displayRange={displayRange}
                rowNumber={rowNumber}
                lastRow={lastRow}
                setLastRow={setLastRowWithCaution}
                lastPossibleRow={preparedList.length}
            />
        </section>
    );

    return preparedList?.length ? template : '';
}