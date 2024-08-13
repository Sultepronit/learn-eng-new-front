import { useState } from "react";
export default function StatusBar({ fetchStatus, error }) {
    const [showMessage, setShowMessage] = useState(true);
    // console.log(fetchStatus);
    // console.log(error);

    return (
        <>
            <p className={`status-bar ${fetchStatus}`}></p>
            {error && showMessage ?
                (<div className="error-message">
                    <p>{error}</p>
                    <button onClick={() => setShowMessage(false)}>Hide</button>
                </div>) : ''
            }
            
        </>
    );
}