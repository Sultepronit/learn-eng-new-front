import { directions } from "./statuses";

export default function CardView({ card, questionMode }) {
    const word = questionMode && card?.direction === directions.BACKWARD ? '' : card.word;
    
    const translation = {
        __html: questionMode && card?.direction === directions.FORWARD
            ? '' : card.translation
    };

    // console.log(card);

    return (
        <section className="card-view">
            <div>
                <p>
                    {card.number} [{card.repeatStatus}] {card.tapFProgress} {card.tapBProgress} | 
                    <span className="spaced">{card.tapFRecord} {card.tapBRecord}</span>
                </p>
            </div>
            <div className="card-view">
                <p className="word">{word}</p>
                <p className="transcription">{questionMode ? '' : card.transcription}</p>
                <p className="translation" dangerouslySetInnerHTML={translation} />
                <p className="example">{questionMode ? '' : card.example}</p>
            </div>
        </section>
    );
}