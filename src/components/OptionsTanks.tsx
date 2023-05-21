export default function OptionsTanks() {
    return (
        <div className="flex flex:col flex-shrink:0  flex-basis:99.3%@sm flex-basis:32.5%@md">
            <div className="border px-4 py-2 bg-white shadow mb-4 rounded h-100">
                <h4 className="small text-muted col-12 my-2 font-weight-normal">
                    Setup
                </h4>
                <div className="row">
                    <form className="form-inline col-12 col-md-6">
                        <h4 className="col-12 small text-muted mb-3 pt-3 border-top">
                            Capacity
                        </h4>
                        <div className="form-group col-12 mb-3">
                            <label className="form-label" htmlFor="input-max-level">
                                Maximum
                            </label>
                            <input
                                className="form-control"
                                id="input-max-level"
                                type="number"
                                min={0}
                                disabled=""
                            />
                            <small className="col-sm-3 col-xs-12 form-text text-muted">
                                Lts
                            </small>
                        </div>
                        <div className="form-group col-12 mb-5">
                            <label className="form-label" htmlFor="input-min-level">
                                Minimum
                            </label>
                            <input
                                className="form-control"
                                id="input-min-level"
                                type="number"
                                min={0}
                                disabled=""
                            />
                            <label className="col-sm-3 col-xs-12 form-text text-muted">
                                Lts
                            </label>
                        </div>
                    </form>
                    <form className="form-inline col-12 col-md-6">
                        <h4 className="col-12 small text-muted mb-3 pt-3 border-top">
                            Alarms
                        </h4>
                        <div className="form-group col-12 mb-3">
                            <label className="form-label" htmlFor="input-high-level-alarm">
                                High Level
                            </label>
                            <input
                                className="form-control"
                                id="input-high-level-alarm"
                                type="number"
                                disabled=""
                            />
                            <small className="col-sm-3 col-xs-12 form-text text-muted">
                                Lts
                            </small>
                        </div>
                        <div className="form-group col-12 mb-5">
                            <label className="form-label" htmlFor="input-low-level-alarm">
                                Low Level
                            </label>
                            <input
                                className="form-control"
                                id="input-low-level-alarm"
                                type="number"
                                disabled=""
                            />
                            <small className="col-sm-3 col-xs-12 form-text text-muted">
                                Lts
                            </small>
                        </div>
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