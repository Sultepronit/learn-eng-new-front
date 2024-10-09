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