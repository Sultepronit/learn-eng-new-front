import { marks } from "./statuses";

function commonEvaluation(card) {
    if (card.mark === marks.GOOD) {
        card[`tap${card.direction}Progress`] = 1;
    } else {
        card[`tap${card.direction}Progress`]--;
    }
}

export default function evaluate(card) {
    const freezed = { ...card };

    commonEvaluation(card); 

    const changes = {};
    for (const key in card) {
        if (card[key] !== freezed[key]) changes[key] = card[key];
    }

    return changes;
}