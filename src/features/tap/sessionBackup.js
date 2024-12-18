// export function bakcupSessionConsts(stages, updatable) {
export function bakcupSessionConsts({ stages, sessionLength, nextRepeated }, updatable) {
    localStorage.setItem('tapSessionConsts', JSON.stringify(
        { stages, sessionLength, nextRepeated, updatable: !!updatable }
    ));
}

export function backupSession(session, progress) {
    localStorage.setItem('tapSession', JSON.stringify({ content: session, progress }));
}

export function restoreSession() {
    const session = JSON.parse(localStorage.getItem('tapSession'));
    if (!session?.content.length) return null;
    // const stages = JSON.parse(localStorage.getItem('tapStages'));
    const consts = JSON.parse(localStorage.getItem('tapSessionConsts'));

    return {
        session: session.content,
        progress: session.progress,
        ...consts,
        backup: true
    };
}

export function removeSessionBackup() {
    localStorage.removeItem('tapSession');
}