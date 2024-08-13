import './DatabaseEdit.css';
import { useState, useEffect } from "react";
import Table from "./components/Table.jsx";
import { useDispatch, useSelector } from 'react-redux';
import { fetchDb, selectDb } from '../../features/api/apiSlice.js';
// import fetchStatus from "../../services/fetchStatus.js";

export default function DatabaseEdit() {
    const dispatch = useDispatch();

    const db = useSelector(selectDb);

    useEffect(() => {
        dispatch(fetchDb());
    }, [dispatch]);

    return (
        <section>
            <button onClick={() => dispatch(fetchDb())}>
                refresh
            </button>
            <Table data={db} />
        </section>
    );
}