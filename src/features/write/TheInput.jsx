import { useState, useEffect, useRef } from "react";

export default function TheInput({
    expectedValue,
    isActive,
    correctSpelling,
    setCorrectSpelling
}) {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        setInputValue('');
    }, [expectedValue]);

    useEffect(() => {
        if (isActive && inputRef.current) inputRef.current.focus();
    }, [isActive])

    useEffect(() => {
        if (inputValue === expectedValue) {
            console.log('bingo!');
            setCorrectSpelling(true);
        } else {
            setCorrectSpelling(false);
        }
    }, [expectedValue, inputValue]);

    return (
        <input
            type="text"
            className="learn-input"
            disabled={!isActive}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            ref={inputRef}
        />
    )
}