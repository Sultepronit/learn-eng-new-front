import { useSelector } from "react-redux";
import { getSelectedCardId } from "./listSlice";
import TableRow from "./TableRow";

export default function TableBody({ displayRange }) {
    const selectedCardId = useSelector(getSelectedCardId);

    return (
        <div className="table-body">
            {displayRange.map(cardId => (
                <TableRow
                    key={cardId}
                    cardId={cardId}
                    isSelected={selectedCardId === cardId}
                />
            ))}
        </div>
    );
}