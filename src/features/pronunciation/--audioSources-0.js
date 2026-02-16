// real records
async function getRecordUrls() {
    const resp = await fetch('/recordUrls.json');
    return await resp.json();
}
const urlListPromise = getRecordUrls();

const urlKeys = {
	"a": "https://s3.amazonaws.com/audio.vocabulary.com/1.0/us/",
	// "cb": "https://dictionary.cambridge.org/us/media/english/uk_pron/",
	"ca": "https://dictionary.cambridge.org/us/media/english/us_pron/",
	"oa": "https://www.onelook.com/pronounce/macmillan/US/",
	// "ob": "https://www.onelook.com/pronounce/macmillan/UK/"
};

async function getVerifiedRecords(expression) {
    const urlList = await urlListPromise;

    const compactUrls = urlList[expression];

    // return compactUrls?.map(compactUrl => {
    //     const [encoded, query] = compactUrl.split('*');
    //     console.log(encoded)
    //     if (encoded === "cb" || encoded === "ob") return null;
    //     return urlKeys[encoded] + query;
    // });

    if (!compactUrls) return [];
    
    const re = [];
    for (const compactUrl of compactUrls) {
        const [encoded, query] = compactUrl.split('*');
        if (encoded === "cb" || encoded === "ob") continue;
        re.push(urlKeys[encoded] + query);
    }
    return re;
}

// synth records
// const apiUrl = import.meta.env.VITE_API_URL;
// const speakers = ['m2', 'f2', 'm1', 'f1'];
const ttsUrl = import.meta.env.VITE_TTS_URL;
function getSynthRecords(expression, limit = 6) {
    // return speakers.map(speaker =>
    //     `${apiUrl}/audio/${expression}_${speaker}.wav`
    // );
    const re = [];
    for (let i = 1; i <= limit; i++) {
        re.push(`${ttsUrl}/${expression}/${i}.mp3`);
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