import WaterAnimation from "./WaterAnimation.tsx";
import IconDroplet from "../icons/IconDroplet.tsx";

export default function WaterTank() {
    return (
        <section className={"position:relative border mt:1em p-2 mb-4 bg-white shadow rounded"}>
            <button
                className={"position:absolute text-align:center top:10 right:15 bg:#d00000 fg:white font:bold b:none r:50% w:3.5em h:3.5em"}>Drain
            </button>
            
            <WaterAnimation backgroundColor={"white"} waterLevel={"hight"}/>
            
            <div className={"flex flex:row gap:1em justify-content:center align-items:center bg:#f5f3f4 my:1em r:2em py:0.3em"}>
                <div className={"flex justify-content:center align-items:center bg:#0096c7 fg:white w:2em h:2em r:50%"}>
                    <IconDroplet size={22}/>
                </div>
                <p className={"p:0 m:0 font-size:1.2em font:bold fg:#0096c7"}>370 Water Drops</p>
            </div>
        </section>
    )
}