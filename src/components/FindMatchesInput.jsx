import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { findMatches } from "../features/list/listSlice";

export default function FindMatchesInput({ name, value, placeholder, className, onChange }) {
    const dispatch = useDispatch();

    const [localValue, setLocalValue] = useState('');

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    function handleSubmit(newValue) {
        if(newValue === value) return;
        onChange({ name, value: newValue });
    }

    function handleKeyUp(event) {
        if(event.key !== 'Enter') return;
        handleSubmit(localValue);
    }

    function handleInput(newValue) {
        console.log(newValue);
        setLocalValue(newValue);
        dispatch(findMatches(newValue));
    }

    function handleBlur() {
        handleSubmit(localValue);
        dispatch(findMatches(''));
    }

    return (
        <input
            type="text"
            name={name}
            className={className}
            placeholder={placeholder}
            value={localValue}
            onFocus={() => dispatch(findMatches(localValue))}
            onChange={(e) => handleInput(e.target.value)}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
        />
    );
}