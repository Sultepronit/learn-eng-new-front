import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="navigation">
            <Link to="/list" className="view-link">Edit List</Link>
            <Link to="/tap-lesson" className="view-link">Tap Lesson</Link>
            <Link to="/list" className="view-link">Write Lesson</Link>
            {/* <button><Link to="/list" className="view-link">Edit List</Link></button>
            <button>Tap Lesson</button>
            <button>Write Lesson</button> */}
        </div>
    );
}