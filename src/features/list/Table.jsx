// import { useState } from "react";
import TableRow from "./TableRow";

export default function Table({ data }) {
    return (
        <section className="table">
            {data?.length && data.map(card => (
                <TableRow
                    key={card.id}
                    card={card}
                />
            ))}
        </section>
    );
}