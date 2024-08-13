import './listStyle.css';
import { useState, useEffect } from "react";
import Table from "./Table.jsx";
import { useDispatch, useSelector } from 'react-redux';
import { fetchDb, selectDb } from '../../features/api/apiSlice.js';
import CardEditor from './CardEditor.jsx';

export default function ListView() {
    const dispatch = useDispatch();

    const db = useSelector(selectDb);

    useEffect(() => {
        dispatch(fetchDb());
    }, [dispatch]);

    return (
        <section>
            <CardEditor />
            <button onClick={() => dispatch(fetchDb())}>
                refresh
            </button>
            <Table data={db} />
        </section>
    );
}