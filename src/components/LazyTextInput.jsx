import { useEffect, useRef, useState } from "react";

/**
 * A text input that can be freely edited without redundant rerendering.
 * The value is set at the value prop changes.
 * At blur or Enter key press it checks if new value has been inputted,
 * if so, the callback "onChange" is invoked with { name, value } object as argument.
 */
export default function LazyTextInput({ name, value, placeholder, className, onChange }) {
    const inputRef = useRef(null);
    
    const [lastValue, setLastValue] = useState('');

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
            className={className}
            placeholder={placeholder}
            ref={inputRef}
            onKeyUp={handleKeyUp}
            onBlur={(e) => handleSubmit(e.target.value)}
        />
    );
}