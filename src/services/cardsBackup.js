let db = null;

function openLocalDb() {
    return new Promise((resolve, reject) => {
        const openRequest = indexedDB.open('db', 2);

        openRequest.onupgradeneeded = () => {
            console.log('upgrading!');
            const newDb = openRequest.result;
            if(!newDb.objectStoreNames.contains('cards')) {
                newDb.createObjectStore('cards', { keyPath: 'id' });
            }
        };

        openRequest.onerror = () => {
            console.error(openRequest.error);
            reject('Error opening IndexedDb!');
        };

        openRequest.onsuccess = () => {
            db = openRequest.result;
            console.log(db)
            resolve('Success!');
        }
    });
}

export async function restoreBackup() {
    await openLocalDb();
    const transaction = db.transaction('cards');
    const cards = transaction.objectStore('cards');
    const request = cards.getAll();

    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(request.error);
    });
}

export function setBackup(list) {
    console.timeLog('t', 'backupping...');
    if(!db) {
        setTimeout(() => setBackup(list), 200);
        return;
    }
    const transaction = db.transaction('cards', 'readwrite');
    const cards = transaction.objectStore('cards');
    cards.clear();
    for(const card of list) {
        const request = cards.put(card);
        request.onerror = () => console.warn(request.error);
    }

    transaction.oncomplete = () => console.timeLog('t', 'backup updated!');
    transaction.onerror = () => console.error(transaction.error);
}

// https://learn.javascript.ru/indexeddb