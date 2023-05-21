import WaterAnimation from "./WaterAnimation.tsx";
import IconDroplet from "../icons/IconDroplet.tsx";
import {useContext} from "react";
import {IWaterContext, WaterContext} from "../context/WaterContext.tsx";

export default function WaterTank() {
    const waterContext = useContext<IWaterContext>(WaterContext);

    return (
        <section className={"flex flex:col flex-shrink:0 flex-basis:99.3% flex-basis:49.3%@sm flex-basis:33%@md position:relative border p:0.5em bg-white shadow rounded"}>
            <button
                className={"position:absolute text-align:center top:15 right:15 bg:#d00000 fg:white font:bold b:none r:50% w:3.5em h:3.5em"}>Drain
            </button>
            
            <WaterAnimation className={"mt:1em"} backgroundColor={"white"} waterLevel={"hight"}/>
            
            <div className={"flex flex:row gap:1em justify-content:center align-items:center bg:#f5f3f4 my:1em r:2em py:0.3em"}>
                <div className={"flex justify-content:center align-items:center bg:#0096c7 fg:white w:2em h:2em r:50%"}>
                    <IconDroplet size={22}/>
                </div>
                <p className={"p:0 m:0 font-size:1.2em font:bold fg:#0096c7"}>{waterContext.waterLevel} Water Drops</p>
            </div>
        </section>
    )
}