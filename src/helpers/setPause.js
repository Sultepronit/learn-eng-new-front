export default function setPause(timeout) {
    return new Promise((resolve) => {
        setTimeout(() => resolve('it\'s time!'), timeout);
    });
}

// for (let i = 0; i < 10; i++) {
//     await setPause(300);
//     console.log(i);
// }