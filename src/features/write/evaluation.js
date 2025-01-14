import { marks } from "./statuses";
import { selectNextRepeated } from "./writeSlice";
import { store } from "../../app/store";

function tryAndDegrade(card, progressUpdate) {
    card.writeStatus = 0;
    card.writeFProgress = 0;
    card.writeBProgress = 0;
    card.repeatStatus = 0;
    card.tapFProgress = 0;
    card.tapBProgress = 0;

    progressUpdate.push('degrade');
}

function tryAndUpgrade(card, progressUpdate) {
    // const nextRepeated = selectNextRepeated(store.getState());
    // console.log(nextRepeated);
    if (card.writeFProgress > 0 && card.writeBProgress > 0) {
        card.writeFProgress = 0;
        card.writeBProgress = 0;

        card.writeStatus = selectNextRepeated(store.getState());

        progressUpdate.push('upgrade');
    }
}

function updateProgress(card, mark, progressUpdate) {
    if (mark === marks.GOOD) {
        card[`write${card.direction}Progress`] = 1;
        progressUpdate.push('good');
    } else {
        card[`write${card.direction}Progress`]--;
        progressUpdate.push('retry');
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

    console.log(changes);
    console.log(progressUpdates);

    return {
        cardChanges: changes,
        progressUpdates
    };
}