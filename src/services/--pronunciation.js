import setPause from "../helpers/setPause";

const apiUrl = import.meta.env.VITE_API_URL;
const speakers = ['m2', 'f2', 'm1', 'f1'];
export default function urlsForExpression(expression) {
    return speakers.map(speaker =>
        `${apiUrl}/audio/${expression}_${speaker}.wav`
    );
}

let urlList = null;
(async () => {
    const resp = await fetch('/recordUrls.json');
    urlList = await resp.json();
}) ();

let currentExpression = '';
let currentExpressionUrls = null;
const audio = new Audio();

const urlKeys = {
	"a": "https://s3.amazonaws.com/audio.vocabulary.com/1.0/us/",
	"cb": "https://dictionary.cambridge.org/us/media/english/uk_pron/",
	"ca": "https://dictionary.cambridge.org/us/media/english/us_pron/",
	"oa": "https://www.onelook.com/pronounce/macmillan/US/",
	"ob": "https://www.onelook.com/pronounce/macmillan/UK/"
};

async function findAudio(expression) {
    if(!urlList || !urlsForExpression) {
        await setPause(400);
        return findAudio(expression);
    }

    const compactUrls = urlList[expression];

    if(compactUrls) {
        currentExpressionUrls = compactUrls.map(compactUrl => {
            const [encoded, query] = compactUrl.split('*');
            return urlKeys[encoded] + query;
        });
    } else {
        currentExpressionUrls = urlsForExpression(currentExpression);
    }

    console.log(currentExpressionUrls);
}

let currentIndex = 0;
function playNext() {
    if(currentIndex >= currentExpressionUrls.length) currentIndex = 0; 

    console.log(currentIndex);
    console.log(currentExpressionUrls[currentIndex]);

    audio.src = currentExpressionUrls[currentIndex++];
    audio.play();
}

export async function pronounce(expression) {
    if(currentExpression !== expression) {
        currentExpression = expression;
        await findAudio(expression);
    }

    playNext();
}