import {useContext} from "react";
import {IWaterContext, WaterContext} from "../context/WaterContext.tsx";

export default function ControlTanks() {
    const waterContext = useContext<IWaterContext>(WaterContext);

    return (
        <div className="flex flex:col flex-shrink:0 flex-basis:49.3%@sm flex-basis:33%@md bg-white shadow rounded">
            <div className="border px-4 py-2 mb-4  h-100">
                <h4 className="small text-muted col-12 my-2 font-weight-normal border-bottom pb-2">
                    Options
                </h4>
                <form>
                    <label className="form-label col-12">
                        Set Point (Lts)
                        <input
                            id="input-set-point"
                            className="form-control"
                            type="text"
                            name="set-point"
                            min={0}
                            required=""
                        />
                    </label>
                    <button
                        className="col-12 btn btn-primary px-4"
                        id="button-set-point"
                        type="button"
                        onclick="setPointOfTank()"
                        >
                        Set
                    </button>
                </form>
            </div>
        </div>
    )
}