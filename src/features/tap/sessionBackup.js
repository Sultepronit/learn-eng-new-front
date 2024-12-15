export function bakcupSessionConsts({ stages, updatable }) {
    localStorage.setItem('tapSessionConsts', JSON.stringify({ stages, updatable: !!updatable }));
}

export function backupSession(session) {
    localStorage.setItem('tapSession', JSON.stringify({ content: session }));
}

export function restoreSession() {
    const session = JSON.parse(localStorage.getItem('tapSession'));
    if (!session?.content.length) return null;
    // const stages = JSON.parse(localStorage.getItem('tapStages'));
    const consts = JSON.parse(localStorage.getItem('tapSessionConsts'));

    return { session: session.content, ...consts, backup: true };
}

export function removeSessionBackup() {
    localStorage.removeItem('tapSession');
}