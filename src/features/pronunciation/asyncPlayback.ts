const audio = new Audio();
let playPromise = null;

async function asyncPlayback(url: string, volume = 1) {
    console.log('playing:', volume, url);
    // if (playPromise) await playPromise.catch((e) => {console.warn(e)});
    if (playPromise) await playPromise.catch(() => {});

    // audio.pause();
    // audio.removeAttribute('src');
    // audio.load();
    // if (!audio.paused) audio.pause();
    
    audio.volume = volume;
    audio.src = url;
    
    const re = await new Promise(res => {
        // const timerId = setTimeout(() => res('timeout'), 9000);
        const timerId = setTimeout(() => res('ended'), 9000);
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
            console.warn(audio.error);
            // alert('error playing')
        }

        audio.addEventListener('ended', onEnded);
        audio.addEventListener('error', onError);

        playPromise = audio.play();
        // audio.play().catch((err) => {
        playPromise.catch((err) => {
            cleanup();
            res(err);
        });
    });

    if (re !== 'ended') {
        console.warn(re);
        return 'failed';
    }

    return 'ended';
}

export default asyncPlayback;