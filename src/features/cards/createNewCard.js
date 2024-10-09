import { backUpNewCard } from "../../services/cardsBackup";

export default function createNewCard(lastCard) {
    const newCard = {
        dbid: -1,
        number: lastCard.number + 1,
        repeatStatus: -1,
        word: '',
        transcription: '',
        translation: '',
        example: '',
        tapFProgress: 0,
        tapFRecord: 0,
        tapFAutorepeat: 0,
        tapBProgress: 0,
        tapBRecord: 0,
        tapBAutorepeat: 0,
        writeStatus: 0,
        writeFProgress: 0,
        writeFRecord: 0,
        writeFAutorepeat: 0,
        writeBProgress: 0,
        writeBRecord: 0,
        writeBAutorepeat: 0
    };

    // backUpNewCard(newCard);
    
    return newCard;
}