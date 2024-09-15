import { useSelector } from "react-redux";
import { getSelectedCard, getSelectedCardId } from "./listSlice";
import TableRow from "./TableRow";

export default function TableBody({ displayRange }) {
    // const selectedCardId = useSelector(getSelectedCardId);
    const selectedCard = useSelector(getSelectedCard);

    return (
        <div className="table-body">
            {displayRange.map(cardId => (
                <TableRow
                    key={cardId}
                    cardId={cardId}
                    // isSelected={selectedCardId === cardId}
                    isSelected={selectedCard.id === cardId}
                />
            ))}
        </div>
    );
}