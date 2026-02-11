import { useOutlet } from "react-router-dom";
import { getRecords } from "./audioSources";

const audio = new Audio();

async function asyncPlayback0(url) {
    return new Promise((resolve, reject) => {
        try {
            console.log('playing', url);
            audio.src = url;
            audio.onended = () => resolve('ended');
            audio.onerror = () => reject('error playing');
            audio.play();

            setTimeout(() => resolve('too long'), 9000);
        } catch (error) {
            console.warn(error);
            reject('error!');
        }
    });
}

async function getVoice(url) {
    const resp = await fetch(url);
    const voice = resp.headers.get('X-Voice');
    console.log(voice);
    return voice;
}

async function getMedia(url) {
    const resp = await fetch(url);
    const voice = resp.headers.get('X-Voice');
    const blob = await resp.blob();
    const localUrl = URL.createObjectURL(blob);

    return {
        localUrl,
        voice
    };
}

async function asyncPlayback(url) {
    console.log('playing', url);
    try {
        audio.pause();
        audio.removeAttribute('src');
        audio.load();

        // const { localUrl, voice } = await getMedia(url);
        // console.log(voice);
        
        audio.src = url;
        // audio.src = localUrl;
        audio.load();

        const playback = audio.play();
        const control = new Promise(res => setTimeout(res, 5000));
        await Promise.race([playback, control]);
        // getVoice(url);
        
        return 'ended';
    } catch (err) {
        console.warn(err);
        return 'failed';
    }
}

class ChattyExpression {
    constructor(urls) {
        this.urls = urls;
        this.index = Math.floor(Math.random() * urls.length);
    }

    get nextUrl() {
        this.index++;
        if (this.index >= this.urls.length) this.index = 0;
        return this.urls[this.index];
    }

    async speak() {
        // try {
        //     await asyncPlayback(this.nextUrl); 
        //     return 'ended';
        // } catch (error) {
        //     return 'failed';
        // }
        return await asyncPlayback(this.nextUrl);
    }
}

let currentSpeech = [];

export async function prepareSpeech(variants) {
    
    // receiving
    const urlsForVariants = await Promise.all(
        variants.map((variant) => getRecords(variant))
    );

    // This is strategy for the case that we most of time have not so bad connection
    // (and perfectly wroking caching).
    // If situation is rather reverse the decision is bad!!!

    // preloading
    // const allUrls = urlsForVariants.flat();
    // // console.log('preloading', allUrls);
    // for (const url of allUrls) {
    //     new Audio(url);
    // }

    // preparing for speaking
    // console.log('variants', urlsForVariants);
    currentSpeech = urlsForVariants.map(urls => new ChattyExpression(urls));
    console.log(currentSpeech);
}

export async function speak() {
    for (const chattyExpression of currentSpeech) {
        for (let tries = 0; tries < 10; tries++) {
            const result = await chattyExpression.speak();
            console.log(result);
            if (result === 'ended') break;
        }
    }
}
