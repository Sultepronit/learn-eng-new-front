import { marks } from "./statuses";

function commonEvaluation(card, mark, progressUpdate) {
    if (mark === marks.GOOD) {
        card[`tap${card.direction}Progress`] = 1;
        progressUpdate.push('good');
    } else {
        card[`tap${card.direction}Progress`]--;
        progressUpdate.push('retry');
    }
}

export default function evaluate(inputCard, mark) {
    const card = { ...inputCard };
    const freezed = { ...inputCard };

    const progressUpdate = [];

    commonEvaluation(card, mark, progressUpdate); 

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