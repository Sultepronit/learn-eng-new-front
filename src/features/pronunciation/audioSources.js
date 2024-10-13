// real records
async function getRecordUrls() {
    const resp = await fetch('/recordUrls.json');
    return await resp.json();
}
const urlListPromise = getRecordUrls();

const urlKeys = {
	"a": "https://s3.amazonaws.com/audio.vocabulary.com/1.0/us/",
	"cb": "https://dictionary.cambridge.org/us/media/english/uk_pron/",
	"ca": "https://dictionary.cambridge.org/us/media/english/us_pron/",
	"oa": "https://www.onelook.com/pronounce/macmillan/US/",
	"ob": "https://www.onelook.com/pronounce/macmillan/UK/"
};

async function getRealRecords(expression) {
    // console.log(urlListPromise);
    const urlList = await urlListPromise;

    const compactUrls = urlList[expression];

    return compactUrls?.map(compactUrl => {
        const [encoded, query] = compactUrl.split('*');
        return urlKeys[encoded] + query;
    });
}

// synth records
const apiUrl = import.meta.env.VITE_API_URL;
const speakers = ['m2', 'f2', 'm1', 'f1'];
function getSynthRecords(expression) {
    return speakers.map(speaker =>
        `${apiUrl}/audio/${expression}_${speaker}.wav`
    );
}

export async function getRecords(expression) {
    return await getRealRecords(expression) || getSynthRecords(expression);
}