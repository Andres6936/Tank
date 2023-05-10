export default function App() {
    return (
        <>
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
            <div className="container-fluid">
                <span className="navbar-brand text-muted mb-0 h1">Tank Utilities</span>
            </div>
        </nav>
        <main className="container bg-light">
            <section className="row row-cols-2 mt-2 mb-4">
                <div className="col-12 col-md-8 col-xxl-6 px-2 py-3 ">
                    <div className="border p-2 mb-4 bg-white shadow rounded h-100">
                        <h4 className="small text-muted col-12 my-2 font-weight-normal border-bottom pb-2">
                            Water Tank
                        </h4>
                        <p className="text-center mt-4">
                            <img
                                className="img-thumbnail"
                                id="img-level-tank"
                                src="img/WaterTank.png"
                                alt="Water Tank"
                            />
                        </p>
                        <div className="offset-1 col-10 d-flex justify-content-end">
                            <button
                                className="btn btn-danger mr-2"
                                id="button-drain"
                                type="button"
                                onclick="drainTank()"
                                >
                                Drain
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4 col-xxl-2 px-2 py-3">
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
                <div className="col-12 col-md-12 ml-xxl-4 col-xxl-4 px-2 py-3">
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
            </section>
            <section>
                <img src="img/Water.svg" />
            </section>
            <footer className="small text-muted pb-4">
                Icons made by{" "}
                <a
                    href="https://www.flaticon.com/free-icon/water-tank_1954935?related_item_id=1954974&term=water%20tank"
                    title="Icongeek26"
                    >
                    Icongeek26
                </a>{" "}
                from{" "}
                <a href="https://www.flaticon.com/" title="Flaticon">
                    www.flaticon.com
                </a>
            </footer>
        </main>
        </>
    )
}