import { useSelector } from "react-redux";
import { getSelectedCardNumber } from "./listSlice";
import TableRow from "./TableRow";

export default function TableBody({ displayedList }) {
    const selectedCardNumber = useSelector(getSelectedCardNumber);

    return (
        <div className="table-body">
            {displayedList.map(cardNumber => (
                <TableRow
                    key={cardNumber}
                    cardNumber={cardNumber}
                    isSelected={selectedCardNumber === cardNumber}
                />
            ))}
        </div>
    );
}