import { useEffect, useRef } from "react";

/**
 * Text input which value is set at creation; it can be freely edited afterwards.
 * At blur or Enter key press it checks if the value has been changed,
 * if so, the callback "onChange" is invoked with { name, value } object as argument.
 */
export default function LazyTextInput({ name, value, onChange }) {
    const ref = useRef(null);
    // console.log(value);

    useEffect(() => {
        ref.current.value = value;
        // console.log(value);
    }, [value]);

    function handleSubmit(changes) {
        // console.log(changes);
        if(changes === value) return;
        console.log("here we go!");
        console.log(changes);
        onChange({ name, value: changes });
    }

    function handleKeyUp(event) {
        // console.log(event.key);
        if(event.key !== 'Enter') return;
        handleSubmit(event.target.value);
    }

    return (
        <input
            type="text"
            name={name}
            ref={ref}
            onKeyUp={handleKeyUp}
            onBlur={(e) => handleSubmit(e.target.value)}
        />
    );
}