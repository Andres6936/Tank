import {useContext, useMemo} from "react";
import {IWaterContext, WaterContext} from "../context/WaterContext.tsx";
import {WaterLevel} from "../types/WaterLevel.ts";
import {Thermostat} from "react-thermostat";
import IconSpeedometer2 from "../icons/IconSpeedometer2.tsx";
import IconFlower1 from "../icons/IconFlower1.tsx";
import AlertIcons from "./AlertIcons.tsx";

export default function WaterTank() {
    const waterContext = useContext<IWaterContext>(WaterContext);

    const formatWaterLevel = () => new Intl.NumberFormat("es-CO", {maximumFractionDigits: 0})
        .format(waterContext.waterLevel);


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

    const [leftGradiantFirstWave, rightGradiantFirstWave] = useMemo(() => {
        switch (getCurrentWaterLevel()) {
            case "high":
                return ["#e40b0b", "#fae0e4"]
            case "medium":
                return ["#023e8a", "#ade8f4"]
            case "low":
                return ["#ffd400", "#ffe97f"];
        }
    }, [waterContext.waterLevel])

    return (
        <section
            className={"flex flex:col flex-shrink:0 flex-basis:99.3% flex-basis:49.3%@sm flex-basis:33%@md p:0.5em py:2em"}>
            <div className={"flex position:relative justify-content:center"}>

                <div className={"flex flex:col position:absolute top:5 left:15 gap:0.6em"}>
                    <p className={"m:0 p:0 font-size:4em font:sans font:thin line-height:1.2em"}>
                        {formatWaterLevel()}
                        <span className={"pl:0.1em font-size:0.4em"}>%</span>
                    </p>

                    <div
                        className={"flex justify-content:center align-items:center b:2px|solid|gray w:3.2em h:3.2em r:50%"}>
                        <IconFlower1 className={"opacity:0.6 animation:rotate|3s|infinite|linear"} size={28}/>
                    </div>
                </div>

                <AlertIcons waterLevel={getCurrentWaterLevel()}/>

                <Thermostat
                    size={300}
                    valueSuffix={""}
                    value={waterContext.waterLevel}
                    min={waterContext.minimumLevel}
                    max={waterContext.maximumLevel}
                    onChange={newValue => onChangeWaterLevel(newValue)}
                    track={{
                        colors: [rightGradiantFirstWave, leftGradiantFirstWave]
                    }}
                />
            </div>

            <div className={"flex justify-content:center align-items:center mt:3em"}>
                <div className={"flex justify-content:center align-items:center b:2px|solid|gray w:4em h:4em r:50%"}>
                    <IconSpeedometer2 className={"opacity:0.6"} size={40}/>
                </div>
            </div>
        </section>
    )
}