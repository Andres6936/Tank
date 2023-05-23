import WaterAnimation from "./WaterAnimation.tsx";
import IconDroplet from "../icons/IconDroplet.tsx";
import {useContext} from "react";
import {IWaterContext, WaterContext} from "../context/WaterContext.tsx";
import {WaterLevel} from "../types/WaterLevel.ts";
import CircularButton from "./button/CircularButton.tsx";
import CircularSlider from '@fseehawer/react-circular-slider';

export default function WaterTank() {
    const waterContext = useContext<IWaterContext>(WaterContext);

    const getCurrentWaterLevel = (): WaterLevel => {
        if (waterContext.waterLevel >= waterContext.highLevelAlarm) {
            return "high";
        } else if (waterContext.waterLevel <= waterContext.lowLevelAlarm) {
            return "low";
        } else {
            return "medium";
        }
    }

    const onChangeWaterLevel = (value: string | number) => {
        if (typeof value === 'number') {
            waterContext.setWaterLevel(value);
        }

        const valueOfUser = Number(value);
        if (Number.isNaN(valueOfUser)) {
            // Bad Number Formatted
            return;
        } else {
            waterContext.setWaterLevel(valueOfUser);
        }
    }

    return (
        <section
            className={"flex flex:col flex-shrink:0 flex-basis:99.3% flex-basis:49.3%@sm flex-basis:33%@md position:relative border p:0.5em bg-white shadow rounded"}>
            <div className="flex flex:col gap:0.5em position:absolute top:15 left:15">
                <CircularButton onClick={() => waterContext.incrementWaterLevel()}>
                    <span className={"font:bold font-size:1.5em"}>+</span>
                </CircularButton>
                <CircularButton onClick={() => waterContext.decrementWaterLevel()}>
                    <span className={"font:bold font-size:1.5em"}>-</span>
                </CircularButton>
            </div>

            <button
                className={"position:absolute text-align:center top:15 right:15 bg:#d00000 fg:white font:bold b:none r:50% w:3.5em h:3.5em"}>Drain
            </button>

            <WaterAnimation className={"mt:1em"} backgroundColor={"white"} waterLevel={getCurrentWaterLevel()}/>

            <div
                className={"flex flex:row gap:1em justify-content:center align-items:center bg:#f5f3f4 my:1em r:2em py:0.3em"}>
                <div className={"flex justify-content:center align-items:center bg:#0096c7 fg:white w:2em h:2em r:50%"}>
                    <IconDroplet size={22}/>
                </div>
                <p className={"p:0 m:0 font-size:1.2em font:bold fg:#0096c7"}>{waterContext.waterLevel} Water Drops</p>
            </div>

            <div className={"flex justify-content:center align-items:center my:1em"}>
                <CircularSlider
                    min={waterContext.minimumLevel}
                    max={waterContext.maximumLevel}
                    onChange={(value: number) => onChangeWaterLevel(value)}
                    knobPosition={"left"}
                    label={"Water Drops"}
                    labelColor={"#0096c7"}
                    labelFontSize={"1.8em"}
                />
            </div>
        </section>
    )
}