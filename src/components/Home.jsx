import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="navigation">
            <Link to="/list" className="view-link">Edit List</Link>
            <Link to="/tap-lesson" className="view-link">Tap Session</Link>
            <Link to="/write-session" className="view-link">Write Session</Link>
        </div>
    );
}