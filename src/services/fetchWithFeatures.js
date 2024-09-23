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
        // console.log(response);
        if(response.status === 400) {
            const message = (await response.json()).error;
            console.log('Server responded with:', message);

            if (confirm(`Server responded with:\n${message}\nTry again?`)) {
                return fetchWithFeatures(path, method, inputData, refetch);
            } else {
                return null;
            }
        }
        return await response.json();
    } catch (error) {
        // console.log(error)
        if(refetch) {
            return await retry(fetchWithFeatures, path, method, inputData, refetch);
        } else {
            throw new Error('No connection!');
        }
    }
}

export default fetchWithFeatures; 