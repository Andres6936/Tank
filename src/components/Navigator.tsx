import IconGearWide from "../icons/IconGearWide.tsx";

export default function Navigator() {
    return (
        <nav className="flex flex:row p:1em bb:1px|solid|#CCC bg:white justify-content:space-between align-items:center">
            <h1 className="navbar-brand text-muted mb-0 h1">Tank Utilities</h1>
            <IconGearWide size={22} className={"opacity:0.8"}/>
        </nav>
    )
}