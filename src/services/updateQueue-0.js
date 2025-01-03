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

function asyncFn(data) {
    return new Promise(resolve => {
        setTimeout(() => resolve(`${data} is ready!`), 2000);
    });
}

let testQueue = [];

let isBusy = false;
async function emptyTestQueue() {
    console.log(testQueue);
    if (isBusy) return;
    isBusy = true;

    const { data, resolve } = testQueue[0];
    const result = await asyncFn(data);
    // console.log(testQueue);
    resolve(result);
    
    testQueue.shift();

    isBusy = false;

    // testQueue = JSON.parse(JSON.stringify(testQueue));
    if (testQueue.length) emptyTestQueue();
}

async function populateTestQueue(data) {
    let resolve = null;
    const promise = new Promise(res => resolve = res);
    testQueue.push({ data, resolve });

    emptyTestQueue();

    return promise;
}

// console.log(await populateTestQueue(1));
const re1 = populateTestQueue(1);
const re2 = populateTestQueue(2);
const re3 = populateTestQueue(3);

console.log(re1);
re1.then((re) => console.log(re));
re2.then((re) => console.log(re));
re3.then((re) => console.log(re));

export default updateWithQueue;