export default function StatsView({ progress, cardsPassed, sessionLength }) {
    return (
        <section>
            <p>
                {progress.tries}|{cardsPassed}/{sessionLength} | 
                <span>
                    <span className="spaced i">{progress.retry}</span>
                    <span className="spaced">{progress.good}</span>
                    <span className="spaced b">{progress.upgrade}-{progress.degrade}</span>
                </span>
            </p>
        </section>
    )
}