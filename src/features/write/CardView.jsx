import { directions } from "./statuses";

export default function CardView({ card, questionMode, mark, children }) {
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
        // <section className="write-card-view mark-g">
        <section className={`write-card-view ${mark ? `mark-${mark.toLowerCase()}` : ''}`}>
            <div>
                <p>
                    {card.number} [{card.writeStatus}] {card.writeFProgress} {card.writeBProgress} | 
                    <span className="spaced">{card.writeFRecord} {card.writeBRecord}</span>
                </p>
            </div>
            {/* <div>{children}</div> */}
            <div className="">
                {/* <p className="word">{wordHtml}</p> */}
                <p className="word" dangerouslySetInnerHTML={{ __html: wordHtml }} />
                <p className="transcription">{questionMode ? '' : card.transcription}</p>
                <p className="translation" dangerouslySetInnerHTML={translation} />
                <p className="example">{questionMode ? '' : card.example}</p>
            </div>
        </section>
    );
}