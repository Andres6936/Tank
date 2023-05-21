import IconGearWide from "../icons/IconGearWide.tsx";
import {useNavigate} from "react-router-dom";

export default function Navigator() {
    const navigator = useNavigate();

    return (
        <nav className="flex flex:row p:1em bb:1px|solid|#CCC bg:white justify-content:space-between align-items:center">
            <h1 onClick={() => navigator("/")} className="navbar-brand text-muted mb-0 h1">Tank Utilities</h1>
            <IconGearWide onClick={() => navigator("/options")} size={22} className={"opacity:0.8"}/>
        </nav>
    )
}