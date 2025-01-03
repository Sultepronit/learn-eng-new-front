import { createAsyncThunk } from "@reduxjs/toolkit";
import fetchWithFeatures from "./fetchWithFeatures";

const queue = JSON.parse(localStorage.getItem('updateQueue')) || [];
console.log(queue);
let isBusy = false;

// recursively fetch all the updates stored in the queue, chronologically
async function emptyQueue() {
    console.table(queue);
    localStorage.setItem('updateQueue', JSON.stringify(queue));

    if (isBusy) return;
    isBusy = true;

    const { path, data, resolve } = queue[0];
    const result = await fetchWithFeatures(path, 'PATCH', data);
    if (resolve) resolve(result);
    
    queue.shift();
    isBusy = false;

    if(queue.length) {
        emptyQueue();
    } else {
        localStorage.removeItem('updateQueue');
    }
}

// async function updateWithQueue(path, data, method = 'PATCH') {
async function updateWithQueue(path, data) {
    let resolve = null;
    const promise = new Promise(res => resolve = res);

    queue.push({ path, data, resolve });

    emptyQueue();

    return promise;
}

export const implementResotredUpdates = createAsyncThunk(
    'common/implementResotredUpdates',
    async () => {
        console.log('implementing restored updates!');
        if (!queue.length) return;
        // return;

        const lastUpdate = queue[queue.length - 1];
        const promise = new Promise(res => lastUpdate.resolve = res);

        console.log(lastUpdate);

        emptyQueue();

        await promise;
    }
);

function fakeApi(data) {
    return new Promise(resolve => {
        setTimeout(() => resolve(`${data} is ready!`), 5000);
    });
}

let testQueue = [];

async function emptyTestQueue() {
    console.log(testQueue);
    if (isBusy) return;
    isBusy = true;

    const { data, resolve } = testQueue[0];
    const result = await fakeApi(data);
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

// const re1 = populateTestQueue(1);
// const re2 = populateTestQueue(2);
// const re3 = populateTestQueue(3);

// console.log(re1);
// re1.then((re) => console.log(re));
// re2.then((re) => console.log(re));
// re3.then((re) => console.log(re));

export default updateWithQueue;