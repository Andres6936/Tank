export default function ControlTanks() {
    return (
        <div className="flex flex:col flex-shrink:0 flex-basis:49.3%">
            <div className="border px-4 py-2 mb-4 bg-white shadow rounded h-100">
                <h4 className="small text-muted col-12 my-2 font-weight-normal border-bottom pb-2">
                    Options
                </h4>
                <form className="my-4">
                    <label className="form-label col-12">
                        Level (Lts)
                        <input
                            id="label-level-tank"
                            className="form-control"
                            type="text"
                        />
                    </label>
                    <div className="col-12 btn-group">
                        {/* Area of buttons for control of tank level. */}
                        <button
                            className="btn btn-primary px-4 mr-2"
                            id="button-add-level"
                            type="button"
                            onclick="addLevelOfLiquidInTank()"
                            >
                            +
                        </button>
                        <button
                            className="btn btn-primary px-4"
                            id="button-sub-level"
                            type="button"
                            onclick="subLevelOfLiquidInTank()"
                            >
                            -
                        </button>
                    </div>
                </form>
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