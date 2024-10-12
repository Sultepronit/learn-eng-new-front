import { removeSessionBackup } from "./sessionBackup";

export default function ResetButton({ resetIsActual }) {
    function handleClick() {
        removeSessionBackup();
        location.reload();
    }

    return resetIsActual ? (
        <button className="reset" onClick={handleClick}>↻</button>
    ) : '';
}