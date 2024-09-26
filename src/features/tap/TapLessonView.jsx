import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectDbVersion } from "../cards/cardsSlice";
import { getSession } from "./tapThunks";

export default function TapLessonView() {
    const dispatch = useDispatch();
    const dbVersion = useSelector(selectDbVersion);

    useEffect(() => {
        dispatch(getSession(dbVersion));
    }, [dispatch]);

    return (
        <p>Let's learn!</p>
    )
}