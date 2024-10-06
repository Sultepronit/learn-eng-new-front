export function bakcupStages(stages) {
    localStorage.setItem('tapStages', JSON.stringify(stages));
}

export function backupSession(session) {
    localStorage.setItem('tapSession', JSON.stringify({ content: session }));
}

export function restoreSession() {
    const session = JSON.parse(localStorage.getItem('tapSession'));
    if (!session?.content.length) return null;
    const stages = JSON.parse(localStorage.getItem('tapStages'));

    return { stages, session: session.content, backup: true };
}