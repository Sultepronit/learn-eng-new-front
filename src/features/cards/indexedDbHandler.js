// https://learn.javascript.ru/indexeddb

let db = null;

export function openLocalDb() {
    return new Promise((resolve, reject) => {
        const openRequest = indexedDB.open('db', 2);

        openRequest.onupgradeneeded = () => {
            console.log('upgrade needed!');
            const newDb = openRequest.result;
            if(!newDb.objectStoreNames.contains('cards')) {
                newDb.createObjectStore('cards', { keyPath: 'id' });
            }
        };

        openRequest.onerror = () => {
            console.error(openRequest.error);
            reject('Error opening IndexedDb!');
        }

        openRequest.onsuccess = () => {
            db = openRequest.result;
            console.log(db)
            resolve('Success!');
        }
    });
}

export function setCardsList(list) {
    const transaction = db.transaction('cards', 'readwrite');
    const cards = transaction.objectStore('cards');
    // const request = cards.put(list[0]);
    // request.onsuccess = () => console.log('successfully added', request.result);
    // request.onerror = () => console.warn(request.error);
    for(const card of list) {
        const request = cards.put(card);
        request.onerror = () => console.warn(request.error);
    }

    // transaction.oncomplete = () => console.log('Successfully updated the list!');
    transaction.oncomplete = () => console.timeLog('idb', 'set data!');
    transaction.onerror = () => console.error(transaction.error);
}

export function getCardsList() {
    const transaction = db.transaction('cards');
    const cards = transaction.objectStore('cards');
    const request = cards.getAll();

    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
    });
}

// export function initIndexedDb() {
//     // const openRequest = indexedDB.open('cards', 1);
//     // const openRequest = indexedDB.open('db', 1);
//     const openRequest = indexedDB.open('db', 2);

//     openRequest.onupgradeneeded = () => {
//         console.log('upgrade needed!');
//         const newDb = openRequest.result;
//         if(!newDb.objectStoreNames.contains('cards')) {
//             newDb.createObjectStore('cards', { keyPath: 'id' });
//         }
//     };

//     openRequest.onerror = () => {
//         console.error(openRequest.error);
//     }

//     openRequest.onsuccess = () => {
//         db = openRequest.result;
//         console.log(db)
//     }
// }