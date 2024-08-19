import './listStyle.css';
import './scrollerStyle.css';
import { useState, useEffect } from "react";
import Table from "./Table.jsx";
import { useDispatch, useSelector } from 'react-redux';
import CardEditor from './CardEditor.jsx';
import { fetchData, selectCardIds } from './listSlice.js';
import SearchBar from './SearchBar.jsx';

export default function ListView() {
    const dispatch = useDispatch();

    const cardIds = useSelector(selectCardIds);

    useEffect(() => {
        dispatch(fetchData());
    }, [dispatch]);

    const template = (
        <section>
            <CardEditor />
            <button onClick={() => dispatch(fetchData())}>
                refresh
            </button>
            <SearchBar />
            <Table cardIds={cardIds} />
        </section>
    );

    return cardIds?.length ? template : '';
}