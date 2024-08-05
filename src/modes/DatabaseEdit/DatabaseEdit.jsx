import { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch.js";
import StatusBar from "../../components/StatusBar.jsx";
import fetchStatus from "../../services/fetchStatus.js";

export default function DatabaseEdit({ setFetchStatus }) {
    const [db, setDb] = useState([]);
    const [counter, setCounter] = useState(0);

    // setTimeout(() => {
    //     setCounter(counter+1);
    // }, 2000);
    // console.log("I'm repeating!");

    const { data, status: fetchStatus, error: fetchError } = useFetch('/words');

    return (
        <section>
            <StatusBar
                fetchStatus={fetchStatus}
                error={fetchError?.message}
            />
            <h1>Here will be the table!</h1>
            <p>{counter}</p>
            <ol>
                {data?.length && data?.map(card => (
                    <li key={card.main.id}>
                        {card.main.id} 
                        {card.main.word} 
                        {card.main.transcription} 
                        {card.main.translation}
                    </li>
                ))}
            </ol>
        </section>
    );
}