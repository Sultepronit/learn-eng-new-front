import { directions } from "./statuses";

export default function CardView({ card, questionMode }) {
    return (
        <div className="card-view">
            <p className="word">{
                questionMode && card.direction === directions.FORWARD ? '' : card.word
            }</p>
            <p className="transcription">{questionMode ? '' : card.transcription}</p>
            <p className="translation">{
                questionMode && card?.direction === directions.BACKWARD ? '' : card.translation
            }</p>
            <p className="example">{questionMode ? '' : card.example}</p>
        </div>
    );
}