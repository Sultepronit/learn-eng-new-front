import { getRecords } from "./audioSources";

const audio = new Audio();

async function asyncPlayback(url) {
    return new Promise((resolve, reject) => {
        try {
            console.log('playing', url);
            audio.src = url;
            audio.onended = () => resolve('ended');
            audio.onerror = () => reject('error playing...');
            audio.play();   
        } catch (error) {
            console.warn(error);
            reject('error playing...');
        }
    });
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
        try {
            await asyncPlayback(this.nextUrl); 
            return 'ended';
        } catch (error) {
            return 'failed';
        }
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
    const allUrls = urlsForVariants.flat();
    console.log('preloading', allUrls);
    for (const url of allUrls) {
        new Audio(url);
    }

    // preparing for speaking
    console.log('variants', urlsForVariants);
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
