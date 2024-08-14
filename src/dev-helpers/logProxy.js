export default function logProxy(proxy) {
    console.log(JSON.parse(JSON.stringify(proxy)));
}