import IconDroplet from "../icons/IconDroplet.tsx";
import {useContext, useMemo} from "react";
import {IWaterContext, WaterContext} from "../context/WaterContext.tsx";
import {WaterLevel} from "../types/WaterLevel.ts";
import IconGearWide from "../icons/IconGearWide.tsx";
import {Thermostat} from "react-thermostat";

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

    const [leftGradiantFirstWave, rightGradiantFirstWave] = useMemo(() => {
        switch (getCurrentWaterLevel()) {
            case "high":
                return ["#9d0208", "#d0000099"]
            case "medium":
                return ["#0a5a8b", "#1582e999"]
            case "low":
                return ["#ffaa00", "#ff950099"];
        }
    }, [waterContext.waterLevel])

    return (
        <section
            className={"flex flex:col flex-shrink:0 flex-basis:99.3% flex-basis:49.3%@sm flex-basis:33%@md p:0.5em py:2em"}>
            <div className={"flex justify-content:center"}>
                <Thermostat
                    size={300}
                    value={waterContext.waterLevel}
                    min={waterContext.minimumLevel}
                    max={waterContext.maximumLevel}
                    onChange={newValue => onChangeWaterLevel(newValue)}
                    track={{
                    colors: [rightGradiantFirstWave, leftGradiantFirstWave]
                    }}
                />
            </div>
        </section>
    )
}