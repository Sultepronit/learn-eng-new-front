export default function parseWord(input) {
    try {
        const parts = JSON.parse(input);
        // console.log(parts);
        const chosenIndex = Math.floor(Math.random() * parts.length)
        const result = {
            toPlay: parts.map(({ variant }) => variant),
            questionF: parts[chosenIndex].variant,
            questionB: `<i>${parts[chosenIndex].comment}</i>`,
            answer: parts.reduce((re, part, index) => {
                const chosen = chosenIndex === index;
                const opTag = chosen ? '<u>' : '';
                const clTag = chosen ? '</u>' : '';
                const comment = part.canonicComment ? `<sup>${part.comment}</sup>` : '';
                return `${re}${opTag}${part.variant}${clTag}${comment} `;
            }, '')
        };
        // console.table(result);
        return result;
    } catch (error) {
        return input;
    }
}