import './listStyle.css';
import { useState, useEffect, useMemo } from "react";
import Table from "./Table.jsx";
import { useDispatch, useSelector } from 'react-redux';
import CardEditor from './CardEditor.jsx';
// import { fetchData, selectPreparedList, setSelectedCardId } from './listSlice.js';
import { getSelectedCardId, selectPreparedList } from './listSlice.js';
import { fetchCards } from '../cards/cardsThunks.js';
import SearchBar from './SearchBar.jsx';
import checkIntLimits from '../../helpers/chekIntLimits.js';
// import { selectCardsNumber } from '../cards/cardsSlice.js';

export default function ListView() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCards());
    }, [dispatch]);

    const preparedList = useSelector(selectPreparedList);

    const rowNumber = 21;
    const [lastRow, setLastRow] = useState(0);

    function setLastRowWithCaution(value) {
        setLastRow(checkIntLimits(value, rowNumber, preparedList.length));
    }

    function setLastRowByCardNumber(cardNumber) {
        if(cardNumber < 1) return;
        console.log(cardNumber);
        const theCardIndex = preparedList.findIndex(
            // listCardId => listCardId === Number(cardNumber)
            listCardId => {
                // console.log(listCardId);
                if(listCardId === Number(cardNumber)) {
                    console.log(listCardId, Number(cardNumber))
                    return true;
                }
            }
        );
        if(theCardIndex < 0) return;
        setLastRowWithCaution(theCardIndex + rowNumber);
    }

    useEffect(() => {
        setLastRow(rowNumber);
    }, [preparedList, dispatch]);

    const displayRange = useMemo(() => {
        const result = preparedList.slice(lastRow - rowNumber, lastRow);
        // console.log(result);
        return result;
    }, [preparedList, lastRow]);

    const template = (
        <section>
            <CardEditor />
            <button onClick={() => dispatch(fetchCards())}>
                refresh
            </button>
            <SearchBar
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