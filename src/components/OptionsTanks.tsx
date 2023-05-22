import InputLabel from "./input/InputLabel.tsx";
import {useContext} from "react";
import {IWaterContext, WaterContext} from "../context/WaterContext.tsx";

export default function OptionsTanks() {
    const waterContext = useContext<IWaterContext>(WaterContext);

    return (
        <div className="flex flex:col flex-shrink:0  flex-basis:99.3%@sm flex-basis:32.5%@md border bg-white shadow rounded">
            <div className="px-4 py-2  mb-4 h-100">
                <div className="flex flex:col">
                    <form className="flex flex:col gap:0.7em pb:1em">
                        <h4 className="col-12 small mb-3 pt-3 border-top">
                            Capacity
                        </h4>
                        <InputLabel value={waterContext.maximumLevel} label={"Maximum Liters"}/>
                        <InputLabel value={waterContext.minimumLevel} label={"Minimum Liters"}/>
                    </form>

                    <form className="flex flex:col gap:0.7em pb:1em">
                        <h4 className="col-12 small mb-3 pt-3 border-top">
                            Alarms
                        </h4>

                        <InputLabel value={waterContext.highLevelAlarm} label={"High Level Liters"}/>
                        <InputLabel value={waterContext.lowLevelAlarm} label={"Low Level Liters"}/>
                    </form>
                </div>

                <div className="col-12 btn-group" role="group">
                    <button
                        className="btn btn-primary btn-sm"
                        id="button-edit"
                        type="button"
                        onclick="switchEnableDisableInput()"
                        >
                        Edit
                    </button>
                    <button
                        className="btn btn-primary btn-sm"
                        id="button-cancel"
                        type="button"
                        onclick="cancelChangesInCapacityAndAlarm()"
                        disabled=""
                        >
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary btn-sm"
                        id="button-confirm"
                        type="button"
                        onclick="confirmChangeInCapacityAndAlarm()"
                        disabled=""
                        >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    )
}