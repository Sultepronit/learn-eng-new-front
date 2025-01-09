let version = JSON.parse(localStorage.getItem('dbVersion'));
console.log('saved version:', version);

export function getVersion() {
    return version;
}

export function updateVersion(update) {
    version = { ...version, ...update };
    console.log('new version:', version);
    localStorage.setItem('dbVersion', JSON.stringify(version));
}

function sumVersion(version, ingnore) {
    return Object.values({ ...version, [ingnore]: 0 }).reduce((sum, val) => sum + val, 0);
}

export function incrementVersion(actualVersion, expectedIncrement = 1, ingnore) {
    console.log(version, actualVersion);
    if (sumVersion(actualVersion, ingnore) - sumVersion(version, ingnore) !== expectedIncrement) {
        console.log('too outdated!');
        return 'too outdated!';
    } else {
        version = actualVersion;
        console.log('new version:', version);
        localStorage.setItem('dbVersion', JSON.stringify(version));
        return 'success';
    }
}