import IconGearWide from "../icons/IconGearWide.tsx";
import {useNavigate} from "react-router-dom";
import IconChevronLeft from "../icons/IconChevronLeft.tsx";

export default function Navigator() {
    const navigator = useNavigate();

    return (
        <nav className="flex flex:row p:1em justify-content:space-between align-items:center">
            <div className={"flex bg:white justify-content:center align-items:center  b:1px|solid|gray w:2.5em h:2.5em r:50%"}>
                <IconChevronLeft onClick={() => navigator("/")} size={22} className="opacity:0.6"/>
            </div>

            <div className={"flex flex:col justify-content:center"}>
                <h5 className={"text-align:center p:0 m:0 opacity:0.8"}>Water Tank</h5>
                <p className={"text-align:center p:0 m:0 opacity:0.8 lh:0.6em"}>Monitory</p>
            </div>

            <div className={"flex bg:white justify-content:center align-items:center  b:1px|solid|gray w:2.5em h:2.5em r:50%"}>
                <IconGearWide onClick={() => navigator("/options")} size={22} className={"opacity:0.6"}/>
            </div>
        </nav>
    )
}