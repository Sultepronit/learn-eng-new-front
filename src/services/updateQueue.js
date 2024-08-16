import fetchWithFeatures from "./fetchWithFeatures";

const queue = [];
// console.log(queue);

// recursively fetch all the updates stored in the queue, chronologically
async function emptyQueue() {
    const { path, id, changes } = queue[0];
    await fetchWithFeatures(`${path}/${id}`, 'PATCH', changes);
    
    queue.shift();
    localStorage.setItem('updateQueue', JSON.stringify(queue));

    if(!queue.length) {
        localStorage.removeItem('updateQueue');
        return 'Saved all the queue!';
    }

    return await emptyQueue();
}

async function updateWithQueue(path, id, changes) {
    queue.push({ path, id, changes });
    localStorage.setItem('updateQueue', JSON.stringify(queue));

    // if the queue wasn't empty the function simply reporst about adding the request
    if(queue.length > 1) {
        return new Promise(resolve => resolve('Added to queue'));
    }

    // if the queue is empty the function will wait for the fetch success
    // of the request, and all the next ones, if they would be added
    return await emptyQueue();
}

export default updateWithQueue;