import IconGearWide from "../icons/IconGearWide.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import IconChevronLeft from "../icons/IconChevronLeft.tsx";

export default function Navigator() {
    const navigator = useNavigate();
    const location = useLocation();

    const renderIconBack = () => {
        if (location.pathname === "/options") {
            return (
                <div className={"flex flex:1 justify-content:center"}>
                    <IconChevronLeft
                        onClick={() => navigator("/")} size={22}
                        className="flex bg:white justify-content:center align-items:center  b:1px|solid|gray w:2.5em h:2.5em r:50% opacity:0.6"/>
                </div>
            )
        } else {
            return (
                <div className={"flex flex:1"}/>
            )
        }
    }

    const renderIconOptions = () => {
        if (location.pathname === "/") {
            return (
                <div className={"flex flex:1 justify-content:center"}>
                    <IconGearWide
                        onClick={() => navigator("/options")} size={22}
                        className={"flex bg:white justify-content:center align-items:center  b:1px|solid|gray w:2.5em h:2.5em r:50% opacity:0.6"}/>

                </div>
            )
        } else {
            return (
                <div className={"flex flex:1"}/>
            )
        }
    }

    return (
        <nav className="flex flex:row p:1em justify-content:space-between align-items:center">
            {renderIconBack()}

            <div className={"flex flex:6 flex:col justify-content:center"}>
                <h5 className={"text-align:center p:0 m:0 opacity:0.8"}>Water Tank</h5>
                <p className={"text-align:center p:0 m:0 opacity:0.8 lh:0.6em"}>Monitory</p>
            </div>

            {renderIconOptions()}
        </nav>
    )
}