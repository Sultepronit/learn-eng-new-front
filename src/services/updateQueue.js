import fetchWithFeatures from "./fetchWithFeatures";

const queue = [];
// console.log(queue);

// recursively fetch all the updates stored in the queue, chronologically
async function emptyQueue() {
    const { path, data, method } = queue[0];
    const result = await fetchWithFeatures(path, method, data);
    
    queue.shift();
    localStorage.setItem('updateQueue', JSON.stringify(queue));

    if(!queue.length) {
        localStorage.removeItem('updateQueue');
        // return 'Saved whole the queue!';
        return result;
    }

    return await emptyQueue();
}

// async function updateWithQueue(path, id, changes) {
async function updateWithQueue(path, data, method = 'PATCH') {
    queue.push({ path, data, method });
    localStorage.setItem('updateQueue', JSON.stringify(queue));

    // if the queue is't empty the function simply report about adding the request
    if(queue.length > 1) {
        return new Promise(resolve => resolve('Added to queue'));
    }

    // if the queue is empty the function will wait for the fetch success
    // of the request, and all the next ones, if they would be added
    return await emptyQueue();
}

export default updateWithQueue;