import './listStyle.css';
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { selectCardsTotal } from '../cards/cardsSlice.js';
import {
    selectFirstRow,
    selectPreparedList,
    selectRowNumber,
    setFirstRow
} from './listSlice.js';
import { restoreAndRefreshCards, refreshCards } from '../cards/cardsThunks.js';
import checkIntLimits from '../../helpers/chekIntLimits.js';
import CardEditor from './CardEditor.jsx';
import SearchBar from './SearchBar.jsx';
import Table from "./Table.jsx";
import { implementResotredUpdates } from '../../services/updateQueue.js';
import { selectImplementingResotredUpdates } from '../status/statusSlice.js';

export default function ListView() {
    const dispatch = useDispatch();

    useEffect(() => {
        // dispatch(implementResotredUpdates());
        dispatch(restoreAndRefreshCards());
    }, [dispatch]);

    // const implementingResotredUpdates = useSelector(selectImplementingResotredUpdates);
    // console.log(implementingResotredUpdates);
    // if (implementingResotredUpdates) {
    //     console.log('implementing!')
    // } else {
    //     console.log('implemented!')
    // }

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
        <section className="list-view">
            <CardEditor />
            <button
                className="refresh-button"
                onClick={() => dispatch(refreshCards())}
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