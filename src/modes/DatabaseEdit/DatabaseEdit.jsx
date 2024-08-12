import './DatabaseEdit.css';
import { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch.js";
import StatusBar from "../../components/StatusBar.jsx";
import Table from "./components/Table.jsx";
import { useDispatch, useSelector } from 'react-redux';
import { fetchDb, selectDb } from '../../features/api/apiSlice.js';
// import fetchStatus from "../../services/fetchStatus.js";

export default function DatabaseEdit() {
    const dispatch = useDispatch();
    // const [db, setDb] = useState([]);

    // const [counter, setCounter] = useState(0);
    // setTimeout(() => {
    //     setCounter(counter+1);
    // }, 2000);
    // console.log("I'm repeating!");

    // const { data, status: fetchStatus, error: fetchError } = useFetch('/words');

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