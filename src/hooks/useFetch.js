import { useState, useEffect } from "react";

export default function useFetch(path, method, input) {
    const [data, setData] = useState([]);
    const [status, setStatus] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const apiUrl = import.meta.env.VITE_API_URL;
        
            const options = {
                method,
                body: JSON.stringify(input)
            };
        
            try {
                setStatus('loading');
                
                const local = JSON.parse(localStorage.getItem('db')); // for dev purpuses
                if(local?.length) {
                    setData(local);
                    setStatus('');
                    console.log('local!');
                    return;
                }

                const response = await fetch(apiUrl + path, options);
                const data = await response.json();

                if(data?.length) { // for dev purpuses
                    localStorage.setItem('db', JSON.stringify(data)); 
                }

                setData(data);
                setStatus('');
                console.log('from server!');
            } catch (error) {
                setError(error);
                setStatus('failed');
            }
        }
        fetchData();
    }, [path, method, input]);

    return { data, status, error };
}