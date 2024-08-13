import './listStyle.css';
import { useState, useEffect } from "react";
import Table from "./Table.jsx";
import { useDispatch, useSelector } from 'react-redux';
import { fetchDb, selectDb } from '../../features/api/apiSlice.js';
import CardEditor from './CardEditor.jsx';
import { fetchData, selectData } from './listSlice.js';

export default function ListView() {
    const dispatch = useDispatch();

    // const db = useSelector(selectDb);
    const data = useSelector(selectData);

    useEffect(() => {
        // dispatch(fetchDb());
        dispatch(fetchData());
    }, [dispatch]);

    return (
        <section>
            <CardEditor />
            <button onClick={() => dispatch(fetchDb())}>
                refresh
            </button>
            <Table data={data} />
        </section>
    );
}