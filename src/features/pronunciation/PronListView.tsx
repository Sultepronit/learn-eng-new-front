import "./pron-style.css"
import { useSelector } from "react-redux";
import { selectPronList } from "./pronunciationSlice";
import type { PronList } from "./types";
import PronSelect from "./PronSelect";

export default function PronListView() {
    const variants = useSelector(selectPronList) as PronList[];
    
    return (
        <ul>
            {variants.map((e, i) => 
                <li key={i}>
                    <PronSelect variantI={i} list={e} />
                </li>
            )}
        </ul>
    )
}