import { marks } from "./statuses";

function commonEvaluation(card, mark) {
    if (mark === marks.GOOD) {
        card[`tap${card.direction}Progress`] = 1;
    } else {
        card[`tap${card.direction}Progress`]--;
    }
}

export default function evaluate(inputCard, mark) {
    const card = { ...inputCard };
    const freezed = { ...inputCard };

    commonEvaluation(card, mark); 

    const changes = {};
    for (const key in card) {
        if (card[key] !== freezed[key]) changes[key] = card[key];
    }

    return changes;
}