export default function createNewCard(lastCardNumber) {
    return {
        dbid: -1,
        number: lastCardNumber + 1,
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
}