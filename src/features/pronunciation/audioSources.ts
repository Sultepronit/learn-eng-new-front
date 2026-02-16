import { PronList, RecordData } from "./types";

async function getRecordUrls() {
    const resp = await fetch('/recordUrls.json');
    return await resp.json();
}
const urlsPromise = getRecordUrls();

// to remove
// "cb": "https://dictionary.cambridge.org/us/media/english/uk_pron/",
// "ob": "https://www.onelook.com/pronounce/macmillan/UK/"

const urlKeys = {
	"a": "https://s3.amazonaws.com/audio.vocabulary.com/1.0/us/",
	"ca": "https://dictionary.cambridge.org/us/media/english/us_pron/",
	"oa": "https://www.onelook.com/pronounce/macmillan/US/"
};

const codes = {
    "a": "amazon",
	"ca": "cambridge",
	"oa": "onelook"
};

async function getVerifiedRecords(expression) {
    const urlList = await urlsPromise;

    const compactUrls = urlList[expression];

    if (!compactUrls) return [];
    
    const re: RecordData[] = [];
    for (const compactUrl of compactUrls) {
        const [encoded, query] = compactUrl.split('*');
        if (encoded === "cb" || encoded === "ob") continue;
        re.push({
            url: `${urlKeys[encoded]}${query}`,
            type: 'verified',
            code: codes[encoded]
        });
    }
    return re;
}


const ttsUrl = import.meta.env.VITE_TTS_URL;
function getSynthRecords(expression, limit = 6) {
    const re: RecordData[] = [];
    for (let i = 1; i <= limit; i++) {
        re.push({
            url: `${ttsUrl}/${expression}/${i}.mp3`,
            type: 'synth',
            code: `synth-${i}`
        });
    }
    return re;
}

export async function getRecords(expression) {
    // return await getRealRecords(expression) || getSynthRecords(expression);
    // return getSynthRecords(expression);
    const verified = await getVerifiedRecords(expression);
    if (verified.length > 2) return verified;
    if (verified.length > 0) return [...verified, ...getSynthRecords(expression, 2)];
    return getSynthRecords(expression);
}

export async function preparePronList(variants) {
    // return await Promise.all(
    //     variants.map((variant) => ({
    //         records: getRecords(variant)
    //     }))
    // );
    const re: PronList[] = [];
    for (const variant of variants) {
        const list = await getRecords(variant);
        const currentIndex = Math.floor(Math.random() * list.length);
        re.push({ list, currentIndex, isStale: false });
    }
    return re;
}
