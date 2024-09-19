async function retry(callback, ...args) {   
    return new Promise(resolve => {
        setTimeout(async () => {
            resolve(await callback(...args));
        }, 5 * 1000);
    });
}

async function fetchWithFeatures(path, method, inputData, refetch = true) {
    const apiUrl = import.meta.env.VITE_API_URL;
        
    const options = {
        method,
        body: inputData ? JSON.stringify(inputData) : null,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch(apiUrl + path, options);
        return await response.json();
    } catch (error) {
        if(refetch) {
            return await retry(fetchWithFeatures, path, method, inputData, refetch);
        } else {
            throw new Error('No connection!');
        }
    }
}

export default fetchWithFeatures; 