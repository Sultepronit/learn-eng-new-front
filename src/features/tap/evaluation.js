import { marks, stages } from "./statuses";

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
    if (card.tapFProgress > 0 && card.tapBProgress > 0) {
        card.tapFProgress = 0;
        card.tapBProgress = 0;

        card.repeatStatus = card.repeatStage === stages.LEARN ? 1 
            : card.repeatStage === stages.CONFIRM ? 2 : 8888;

        progressUpdate.push('upgrade');
    }
}

export default function evaluate(inputCard, mark) {
    const card = { ...inputCard };
    const freezed = { ...inputCard };

    const progressUpdate = [];

    if (mark === marks.BAD) {
        tryAndDegrade(card, progressUpdate);
    } else {
        updateProgress(card, mark, progressUpdate); 
        tryAndUpgrade(card, progressUpdate);
    }

    const changes = {};
    for (const key in card) {
        if (card[key] !== freezed[key]) changes[key] = card[key];
    }

    console.log(progressUpdate);

    // return changes;
    return {
        cardChanges: changes,
        // progressChanges: { [card.repeatStage]: progressUpdate }
        progressChanges: { stage: card.repeatStage, updates: progressUpdate }
    };
}