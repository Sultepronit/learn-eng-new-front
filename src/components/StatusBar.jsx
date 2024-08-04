export default function StatusBar({fetchStatus}) {
    console.log(fetchStatus);

    return (
        <>
            <p className={fetchStatus}>Go!</p>
        </>
    );
}