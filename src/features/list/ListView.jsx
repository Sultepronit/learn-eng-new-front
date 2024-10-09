import './listStyle.css';
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { selectCardsTotal, selectDbVersion } from '../cards/cardsSlice.js';
import {
    selectFirstRow,
    selectPreparedList,
    selectRowNumber,
    setFirstRow
} from './listSlice.js';
import { restoreCards, updateLocalCards } from '../cards/cardsAsyncThunks.js';
import checkIntLimits from '../../helpers/chekIntLimits.js';
import CardEditor from './CardEditor.jsx';
import SearchBar from './SearchBar.jsx';
import Table from "./Table.jsx";

export default function ListView() {
    const dispatch = useDispatch();
    // const dbVersion = useSelector(selectDbVersion);

    useEffect(() => {
        dispatch(restoreCards());
        // dispatch(fetchCards(dbVersion));
        // dispatch(updateCards());
        dispatch(updateLocalCards());
    }, [dispatch]);

    const preparedList = useSelector(selectPreparedList);
    const rowNumber = useSelector(selectRowNumber);
    const firstRow = useSelector(selectFirstRow);
    const cardsTotal = useSelector(selectCardsTotal);

    function setFirstRowWithCaution(inputValue) {
        const value = preparedList.length > rowNumber
            ? checkIntLimits(inputValue, 0, preparedList.length - rowNumber) : 0;
        dispatch(setFirstRow(value));
    }

    return (cardsTotal < 1) ? '' : (
        <section>
            <CardEditor />
            <button
                className="refresh-button"
                // onClick={() => dispatch(fetchCards(dbVersion))}
                onClick={() => dispatch(updateLocalCards())}
            >
                refresh
            </button>
            <SearchBar
                setFirstRowWithCaution={setFirstRowWithCaution}
            />
            <Table
                firstRow={firstRow}
                setFirstRowWithCaution={setFirstRowWithCaution}
                lastPossibleRow={preparedList.length}
                rowNumber={rowNumber}
            />
        </section>
    );
}