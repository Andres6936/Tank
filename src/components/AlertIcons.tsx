import IconThermometer from "../icons/IconThermometer.tsx";
import IconThermometerHalf from "../icons/IconThermometerHalf.tsx";
import IconThermometerHigh from "../icons/IconThermometerHigh.tsx";
import {WaterLevel} from "../types/WaterLevel.ts";

interface Props {
    waterLevel: WaterLevel
}

export default function AlertIcons(props: Props) {
    const getStyleForLowAlarm = () => {
        if (props.waterLevel === "low") {
            return "b:2px|solid|#ffd400 fg:#ffd400 font:bold"
        } else {
            return "b:2px|solid|gray opacity:0.5"
        }
    }
    
    const getStyleForMediumAlarm = () => {
        if (props.waterLevel === "medium") {
            return "b:2px|solid|#023e8a fg:#023e8a font:bold"
        } else {
            return "b:2px|solid|gray opacity:0.5"
        }
    }
    
    const getStyleForHighAlarm = () => {
        if (props.waterLevel === "high") {
            return "b:2px|solid|#e40b0b fg:#e40b0b font:bold"
        } else {
            return "b:2px|solid|gray opacity:0.5"
        }
    }
    
    return (
        <div className={"flex flex:col position:absolute top:5 right:15 gap:0.6em"}>
            <div className={"flex justify-content:center align-items:center w:3.2em h:3.2em r:50% " + getStyleForLowAlarm()}>
                <IconThermometer className={"opacity:0.6"} size={40}/>
            </div>

            <div className={"flex justify-content:center align-items:center w:3.2em h:3.2em r:50% " + getStyleForMediumAlarm()}>
                <IconThermometerHalf className={"opacity:0.6"} size={40}/>
            </div>

            <div className={"flex justify-content:center align-items:center w:3.2em h:3.2em r:50% " + getStyleForHighAlarm()}>
                <IconThermometerHigh className={"opacity:0.6"} size={40}/>
            </div>
        </div>
    )
}