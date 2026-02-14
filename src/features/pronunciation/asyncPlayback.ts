const audio = new Audio();

async function asyncPlayback(url: string) {
    console.log('playing', url);
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    
    audio.src = url;
    
    const re = await new Promise(res => {
        const timerId = setTimeout(() => res('timeout'), 5000);
        function cleanup() {
            clearTimeout(timerId);
            audio.removeEventListener('ended', onEnded);
            audio.removeEventListener('error', onError);
        }
        function onEnded() {
            cleanup();
            res('ended');
        }
        function onError() {
            cleanup();
            res('error playing');
        }

        audio.addEventListener('ended', onEnded);
        audio.addEventListener('error', onError);

        audio.play().catch((err) => {
            cleanup();
            res(err);
        });
    });

    if (re !== 'ended') {
        console.warn(re);
        return 'failed';
    }

    return re;
}

export default asyncPlayback;