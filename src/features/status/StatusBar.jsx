import { useState } from "react";
import { useSelector } from "react-redux";
import { getStatus } from "../api/apiSlice";
export default function StatusBar() {
    const status = useSelector(getStatus);
    const error = '';
    const [showMessage, setShowMessage] = useState(true);

    return (
        <>
            <p className={`status-bar ${status}`}></p>
            {/* <p>{timePassed}</p> */}
            {error && showMessage ?
                (<div className="error-message">
                    <p>{error}</p>
                    <button onClick={() => setShowMessage(false)}>Hide</button>
                </div>) : ''
            }
            
        </>
    );
}