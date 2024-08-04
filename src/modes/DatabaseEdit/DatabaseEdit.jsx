import { useState, useEffect } from "react";

export default function DatabaseEdit({ setFetchStatus }) {
    const [db, setDb] = useState([]);

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL;
        async function getTheData() {
            setFetchStatus('loading');
            const response = await fetch(apiUrl + '/words');
            const data = await response.json();
            console.log(data);
            setFetchStatus('clear');
            return data;
            // setDb(data);
        }

        getTheData().then(data => {setDb(data)});
        // const response = await fetch(apiUrl + '/words');
        
        return () => {
            console.log('cleanup!');
        };

    }, []);

    // console.log("I'm here!");

    // setTimeout(() => {
    //     setCounter(counter+1);
    // }, 2 * 1000);

    let index = 1;
    return (
        <section>
            <h1>Here will be the table!</h1>
            <ol>
                {db.map(card => (
                    // <li key={index++}>{card.main.id} {card.main.word}</li>
                    <li key={index}>
                        {index++}
                        {card.main.word} 
                        {card.main.transcription} 
                        {card.main.translation}
                    </li>
                ))}
            </ol>
        </section>
    );
}