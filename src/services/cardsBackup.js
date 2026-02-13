// import setPause from "../helpers/setPause";

// let db = null;

export function openLocalDb() {
    return new Promise((resolve, reject) => {
        // console.timeLog('t', 'opening IndexedDB...');
        console.log('opening IndexedDB...')
        const openRequest = indexedDB.open('db', 7);

        openRequest.onupgradeneeded = () => {
            console.log('upgrading indexedDB!');
            const db = openRequest.result;
            if(!db.objectStoreNames.contains('cards')) {
                db.createObjectStore('cards', { keyPath: 'number' });
            } else {
                db.deleteObjectStore('cards');
                db.createObjectStore('cards', { keyPath: 'number' }); 
            }
        };

        openRequest.onerror = () => {
            console.error(openRequest.error);
            alert('Error opening IndexedDb!');
            reject('Error opening IndexedDb!');
        };

        openRequest.onsuccess = () => {
            console.timeLog('t', 'opened IndexedDB...');
            // db = openRequest.result;
            // resolve('Success!');
            resolve(openRequest.result);
        }
    });
}

const dbPromise = openLocalDb();

export async function restoreAllCards() {
    // console.log(db);
    // console.log('here we go???');
    // if(!db) {
    //     await setPause(200);
    //     return restoreAllCards();
    // }
    // console.log('here we go?');
    const db = await dbPromise;
    const transaction = db.transaction('cards');
    const cards = transaction.objectStore('cards');
    const request = cards.getAll();

    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function restoreCard(id, db) {
    const transaction = db.transaction('cards');
    const cards = transaction.objectStore('cards');
    const request = cards.get(id);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function restoreCards(ids) {
    // if(!db) {
    //     await setPause(200);
    //     return restoreCards(ids)
    // }
    const db = await dbPromise;
    try {
        const promises = ids.map(id => restoreCard(id, db));
        return await Promise.all(promises);
    } catch (error) {
        console.error(error);
    }
}

async function initWriting() {
    const db = await dbPromise;
    return new Promise((resolve) => {
        // if(!db) {
        //     setTimeout(() => initWriting(), 200);
        //     return;
        // }
        const transaction = db.transaction('cards', 'readwrite');
        const cards = transaction.objectStore('cards');
        resolve({ transaction, cards });
    })
}

export async function backupCards(list) {
    const { transaction, cards } = await initWriting();

    console.log(list);
    for(const card of list) {
        const request = cards.put(card);
        request.onerror = () => console.warn(request.error);
    }

    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve('success');
        transaction.onerror = () => reject(transaction.error);
    });
}

export async function backupCard(card) {
    const { cards } = await initWriting();

    // console.log('backupping:', card);

    const request = cards.put(card);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve('success');
        request.onerror = () => {
            alert(request.error);
            reject(request.error);
        }
    });
}