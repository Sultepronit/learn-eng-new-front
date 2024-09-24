import './listStyle.css';
import { useState, useEffect, useMemo } from "react";
import Table from "./Table.jsx";
import { useDispatch, useSelector } from 'react-redux';
import CardEditor from './CardEditor.jsx';
import { selectPreparedList } from './listSlice.js';
import { fetchCards } from '../cards/cardsThunks.js';
import SearchBar from './SearchBar.jsx';
import checkIntLimits from '../../helpers/chekIntLimits.js';
import { selectDbVersion } from '../cards/cardsSlice.js';

export default function ListView() {
    const dispatch = useDispatch();
    const dbVersion = useSelector(selectDbVersion);
    // console.log(dbVersion);

    useEffect(() => {
        dispatch(fetchCards(dbVersion));
    }, [dispatch]);

    const preparedList = useSelector(selectPreparedList);

    const rowNumber = 21;
    const [lastRow, setLastRow] = useState(0);

    function setLastRowWithCaution(value) {
        setLastRow(checkIntLimits(value, rowNumber, preparedList.length));
    }

    function setLastRowByCardNumber(inputNumber) {
        const foundIndex = preparedList.findIndex(cardNumber => cardNumber === Number(inputNumber));
        if(foundIndex < 0) return;
        setLastRowWithCaution(foundIndex + rowNumber);
    }

    useEffect(() => {
        setLastRow(rowNumber);
    }, [preparedList, dispatch]);

    // is't this slice member???
    const displayRange = useMemo(() => {
        const result = preparedList.slice(lastRow - rowNumber, lastRow);
        // console.log(result);
        return result;
    }, [preparedList, lastRow]);

    const template = (
        <section>
            <CardEditor />
            <button
                className="refresh-button"
                onClick={() => dispatch(fetchCards(dbVersion))}
            >
                refresh
            </button>
            <SearchBar
                // changeDisplayRange={setLastRowByCardId}
                changeDisplayRange={setLastRowByCardNumber}
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