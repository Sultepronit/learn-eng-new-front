import { marks, stages } from "./statuses";
import { selectNextRepeated } from "./tapSlice";
import { store } from "../../app/store";

function tryAndDegrade(card, progressUpdate) {
    card.repeatStatus = 0;
    card.tapFProgress = 0;
    card.tapBProgress = 0;

    progressUpdate.push('degrade');
}

function updateProgress(card, mark, progressUpdate) {
    if (mark === marks.GOOD) {
        card[`tap${card.direction}Progress`] = 1;
        progressUpdate.push('good');
    } else {
        card[`tap${card.direction}Progress`]--;
        progressUpdate.push('retry');
    }
}

function tryAndUpgrade(card, progressUpdate) {
    // const nextRepeated = selectNextRepeated(store.getState());
    // console.log(nextRepeated);
    if (card.tapFProgress > 0 && card.tapBProgress > 0) {
        card.tapFProgress = 0;
        card.tapBProgress = 0;

        card.repeatStatus =
            card.repeatStage === stages.LEARN ? 1 
            : card.repeatStage === stages.CONFIRM ? 2
            : selectNextRepeated(store.getState());

        progressUpdate.push('upgrade');
    }
}

export default function evaluate(inputCard, mark) {
    const card = { ...inputCard };
    const freezed = { ...inputCard };

    const progressUpdates = [];

    if (mark === marks.BAD) {
        tryAndDegrade(card, progressUpdates);
    } else {
        updateProgress(card, mark, progressUpdates); 
        tryAndUpgrade(card, progressUpdates);
    }

    const changes = {};
    for (const key in card) {
        if (card[key] !== freezed[key]) changes[key] = card[key];
    }

    console.log(progressUpdates);

    return {
        cardChanges: changes,
        progressChanges: { stage: card.repeatStage, updates: progressUpdates }
    };
}