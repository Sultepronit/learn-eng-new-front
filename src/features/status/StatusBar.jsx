import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStatus, testConnection } from "../api/apiSlice";
export default function StatusBar() {
    const dispatch = useDispatch();

    const [localStaus, setLocalStatus] = useState('');
    const [timePassed, setTimePassed] = useState(false);
    const [showMessage, setShowMessage] = useState(true);

    const error = '';
    const status = useSelector(getStatus);

    useEffect(() => {
        setLocalStatus(status);

        if(status === 'loading') {
            const timeoutId = setTimeout(() => {
                console.log('Time over!');

                setTimePassed(true);

                clearTimeout(timeoutId)
            }, 300);
        }
    }, [status]);

    if(timePassed) {
        setTimePassed(false);
        // if(localStaus === 'loading') {
        if(status === 'loading') {
            // setLocalStatus('stalled');
            dispatch(testConnection());
        }
    }

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