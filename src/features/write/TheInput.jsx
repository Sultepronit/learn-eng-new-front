import { useState, useEffect, useRef } from "react";

export default function TheInput({
    expectedValue,
    isActive,
    stage,
    correctSpelling,
    setCorrectSpelling
}) {
    const [inputValue, setInputValue] = useState('');
    const [goodSoFar, setGoodSoFar] = useState(true);
    const inputRef = useRef(null);

    useEffect(() => {
        setInputValue('');
    }, [expectedValue]);

    useEffect(() => {
        // if (isActive && inputRef.current) inputRef.current.focus();
        if (isActive) {
            setInputValue('');

            if (inputRef.current) inputRef.current.focus();
        }
    }, [isActive])

    useEffect(() => {
        if (inputValue === expectedValue) {
            // console.log('bingo!');
            setCorrectSpelling(true);
        } else {
            if (inputValue === expectedValue.substring(0, inputValue.length)) {
                setGoodSoFar(true);
            } else {
                setGoodSoFar(false);
            }
            setCorrectSpelling(false);
        }
    }, [expectedValue, inputValue]);

    const addStyle = stage === 'question' ? ''
        : stage === 'evaluation' ? (correctSpelling ? 'correct-input' : 'wrong-input')
            : correctSpelling ? 'correct-input' : goodSoFar ? '' : 'wrong-input';

    return (
        <input
            type="text"
            className={`learn-input ${addStyle}`}
            disabled={!isActive}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            ref={inputRef}
        />
    )
}