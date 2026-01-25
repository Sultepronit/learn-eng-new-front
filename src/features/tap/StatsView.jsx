export default function StatsView({ progress, stages, cardsPassed }) {
    return (
        <section>
            <p>
                {progress.tries}|{cardsPassed}/{progress.sessionLength} | 
                <span className="green">
                    <span className="spaced b u">{stages.learn}</span>
                    <span className="spaced i">{progress.learn.retry}</span>
                    <span className="spaced">{progress.learn.good}</span>
                    <span className="spaced b">{progress.learn.upgrade}-{progress.learn.degrade}</span>
                </span> |
                <span className="blue">
                    <span className="spaced b u">{stages.confirm}</span>
                    <span className="spaced i">{progress.confirm.retry}</span>
                    <span className="spaced">{progress.confirm.good}</span>
                    <span className="spaced b">{progress.confirm.upgrade}-{progress.confirm.degrade}</span>
                </span> |
                <span>
                    <span className="spaced b u">{stages.repeat}</span>
                    <span className="spaced i">{progress.repeat.retry}</span>
                    <span className="spaced">{progress.repeat.good}</span>
                    <span className="spaced b">{progress.repeat.upgrade}-{progress.repeat.degrade}</span>
                </span>
            </p>
        </section>
    )
}