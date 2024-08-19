import './listStyle.css';
import './scrollerStyle.css';
import { useState, useEffect } from "react";
import Table from "./Table.jsx";
import { useDispatch, useSelector } from 'react-redux';
// import { fetchDb, selectDb } from '../../features/api/apiSlice.js';
import CardEditor from './CardEditor.jsx';
import { fetchData, selectCardIds, selectData } from './listSlice.js';

export default function ListView() {
    const dispatch = useDispatch();

    // const db = useSelector(selectDb);
    // const data = useSelector(selectData);
    const cardIds = useSelector(selectCardIds);
    console.log(cardIds);

    useEffect(() => {
        // dispatch(fetchDb());
        dispatch(fetchData());
    }, [dispatch]);

    return (
        <section>
            <CardEditor />
            <button onClick={() => dispatch(fetchData())}>
                refresh
            </button>
            {/* <Table data={data.slice(0, 22)} /> */}
            {/* {data?.length && (<Table data={data} cardIds={cardIds} />)} */}
            {cardIds?.length && (<Table cardIds={cardIds} />)}
        </section>
    );
}