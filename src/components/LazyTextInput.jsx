import { useEffect, useRef, useState } from "react";

/**
 * Text input which value is set at creation; it can be freely edited afterwards.
 * At blur or Enter key press it checks if the value has been changed,
 * if so, the callback "onChange" is invoked with { name, value } object as argument.
 */
export default function LazyTextInput({ name, value, onChange }) {
    const inputRef = useRef(null);
    
    const [lastValue, setLastValue] = useState(value);

    useEffect(() => {
        setLastValue(value);
    }, [value]);

    useEffect(() => {
        inputRef.current.value = lastValue;
    }, [lastValue]);

    function handleSubmit(newValue) {
        if(newValue === lastValue) return;
        // console.log(lastValue);
        // console.log(newValue);

        setLastValue(newValue);
        onChange({ name, value: newValue });
    }

    function handleKeyUp(event) {
        if(event.key !== 'Enter') return;
        handleSubmit(event.target.value);
    }

    return (
        <input
            type="text"
            name={name}
            ref={inputRef}
            onKeyUp={handleKeyUp}
            onBlur={(e) => handleSubmit(e.target.value)}
        />
    );
}