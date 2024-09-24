import { useEffect } from 'react';
import './scrollerStyle.css';

export default function TableScroller({displayedRows, allRows, value, setValue}) {
    useEffect(() => {
        const calculated = displayedRows / allRows * 550;
        const thumbHeight = calculated >= 20 ? calculated : 20;
        const style = document.createElement('style');
        style.innerHTML = `
            .scroller::-webkit-slider-thumb {
                height: ${thumbHeight}px;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        }
    }, [displayedRows, allRows]);

    return (displayedRows >= allRows) ? '' : (
        <input
            type="range"
            className="scroller"
            name="scroller"
            min="0"
            max={allRows - displayedRows}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.preventDefault()}
        />
    );
}