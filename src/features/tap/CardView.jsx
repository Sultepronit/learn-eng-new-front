import { directions } from "./statuses";

export default function CardView({ card, questionMode }) {
    let wordHtml = '';
    if (typeof card.word === 'string') {
        wordHtml = questionMode && card.direction === directions.BACKWARD ? '' : card.word;
    } else { // object with variants
        wordHtml = questionMode ? card.word[`question${card.direction}`] : card.word.answer;
    }
    
    const translation = {
        __html: questionMode && card?.direction === directions.FORWARD
            ? '' : card.translation
    };

    return (
        <section className="card-view">
            <div>
                <p>
                    {card.number} [{card.repeatStatus}] {card.tapFProgress} {card.tapBProgress} | 
                    <span className="spaced">{card.tapFRecord} {card.tapBRecord}</span>
                </p>
            </div>
            <div className="card-view">
                {/* <p className="word">{wordHtml}</p> */}
                <p className="word" dangerouslySetInnerHTML={{ __html: wordHtml }} />
                <p className="transcription">{questionMode ? '' : card.transcription}</p>
                <p className="translation" dangerouslySetInnerHTML={translation} />
                <p className="example">{questionMode ? '' : card.example}</p>
            </div>
        </section>
    );
}