import { useState } from "react";
import TableRow from "./TableRow";

export default function Table({ data }) {
    const [selectedNumer, setSelectedNumber] = useState(0);
    console.log(data);

    return (
        <section className="table">
            {data?.length && data.map(card => (
                <TableRow
                    key={card.main.id}
                    card={card}
                    selectedNumer={selectedNumer}
                    setSelectedNumber={setSelectedNumber}
                />
            ))}
        </section>
    );
}