import { useSelector } from "react-redux";
// import { getSelectedCard, getSelectedCardId } from "./listSlice";
import { getSelectedCardNumber } from "./listSlice";
import TableRow from "./TableRow";

export default function TableBody({ displayRange }) {
    // const selectedCardId = useSelector(getSelectedCardId);
    // const selectedCard = useSelector(getSelectedCard);
    const selectedCardNumber = useSelector(getSelectedCardNumber);
    // console.log(displayRange);

    return (
        <div className="table-body">
            {displayRange.map(cardNumber => (
                <TableRow
                    key={cardNumber}
                    // cardId={cardNumber}
                    cardNumber={cardNumber}
                    // isSelected={selectedCardId === cardId}
                    // isSelected={selectedCard.id === cardId}
                    isSelected={selectedCardNumber === cardNumber}
                />
            ))}
        </div>
    );
}