let db = null;

function openLocalDb() {
    return new Promise((resolve, reject) => {
        const openRequest = indexedDB.open('db', 5);

        openRequest.onupgradeneeded = () => {
            console.log('upgrading indexedDB!');
            db = openRequest.result;
            if(!db.objectStoreNames.contains('cards')) {
                // newDb.createObjectStore('cards', { keyPath: 'id' });
                db.createObjectStore('cards', { keyPath: 'number' });
            } else {
                db.deleteObjectStore('cards');
                db.createObjectStore('cards', { keyPath: 'number' }); // for some time...
            }
        };

        openRequest.onerror = () => {
            console.error(openRequest.error);
            reject('Error opening IndexedDb!');
        };

        openRequest.onsuccess = () => {
            db = openRequest.result;
            resolve('Success!');
        }
    });
}
// openLocalDb();

export async function restoreBackup() {
    await openLocalDb();
    // if(!db) {
    //     setTimeout(() => restoreBackup(), 200);
    //     return;
    // }
    const transaction = db.transaction('cards');
    const cards = transaction.objectStore('cards');
    const request = cards.getAll();

    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function initWriting() {
    return new Promise((resolve, reject) => {
        if(!db) {
            setTimeout(() => initWriting(), 200);
            return;
        }
        const transaction = db.transaction('cards', 'readwrite');
        const cards = transaction.objectStore('cards');
        resolve({ transaction, cards });
    })
}

export async function setBackup(list, dbVersion) {
    console.timeLog('t', 'backupping...');
    const { transaction, cards } = await initWriting();

    // console.log(list);
    for(const card of list) {
        try {
            const request = cards.put(card);
            request.onerror = () => console.warn(request.error);
        } catch (error) { // for empty card proxy
            console.warn(error);
        }
        
    }

    transaction.oncomplete = () => {
        localStorage.setItem('dbVersion', JSON.stringify(dbVersion));
        console.timeLog('t', 'backup updated!');
    }
    transaction.onerror = () => console.error(transaction.error);
}

export async function bakcupOneCard(cardNumber, changes, dbVersion) {
    const { cards } = await initWriting();

    const getRequest = cards.get(cardNumber);
    getRequest.onsuccess = () => {
        const updatedCard = { ...getRequest.result, ...changes };
        const putRequest = cards.put(updatedCard);
        putRequest.onerror = () => console.error(putRequest.error);
        putRequest.onsuccess = () => {
            if(dbVersion) {
                localStorage.setItem('dbVersion', JSON.stringify(dbVersion));
            }
        };
    }
}

export async function backUpNewCard(card) {
    const { cards } = await initWriting();

    const request = cards.put(card);
    request.onerror = () => console.error(request.error);
    request.onsuccess = () => console.log('added empty card to backup!');
}

// https://learn.javascript.ru/indexeddb