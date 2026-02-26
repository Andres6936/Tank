import React, { useContext, useState } from "react";
import InputLabel from "./input/InputLabel.tsx";
import { IWaterContext, WaterContext } from "../context/WaterContext.tsx";

type ContextRootProps = {
  maximumLevel: number;
  onChangeMaximumLevel: (value: number) => void;
  minimumLevel: number;
  onChangeMinimumLevel: (value: number) => void;
};

const ContextRoot = React.createContext<ContextRootProps | null>(null);

const useContextRoot = () => {
  const context = useContext(ContextRoot);
  if (!context) {
    throw new Error("useContextRoot must be used within a ContextRoot");
  }
  return context;
};

const FieldMaximumLiters = () => {
  const { maximumLevel, onChangeMaximumLevel } = useContextRoot();

  return (
    <InputLabel
      value={maximumLevel}
      onChange={(e) => onChangeMaximumLevel(e.target.valueAsNumber)}
      label={"Maximum Liters"}
    />
  );
};

const FieldMinimumLiters = () => {
  const { minimumLevel, onChangeMinimumLevel } = useContextRoot();

  return (
    <InputLabel
      value={minimumLevel}
      onChange={(e) => onChangeMinimumLevel(e.target.valueAsNumber)}
      label={"Minimum Liters"}
    />
  );
};

export default function OptionsTanks() {
  const waterContext = useContext<IWaterContext>(WaterContext);

  const [maximumLevel, setMaximumLevel] = useState(waterContext.maximumLevel);
  const [minimumLevel, setMinimumLevel] = useState(waterContext.minimumLevel);

  return (
    <ContextRoot.Provider
      value={{
        maximumLevel,
        onChangeMaximumLevel: setMaximumLevel,
        minimumLevel,
        onChangeMinimumLevel: setMinimumLevel,
      }}
    >
      <div className="flex flex-col flex-shrink:0  flex-basis:99.3%@xs flex-basis:50%@sm flex-basis:32.5%@md ">
        <div className=" r:1em b:1px|solid|#CCC px:2em py:1em  mb:2em h:100%">
          <div className="flex flex-col">
            <form className="flex flex-col gap:0.7em pb:1em">
              <h4 className="col-12 small mb-3 pt-3">Capacity</h4>
              <FieldMaximumLiters />
              <FieldMinimumLiters />
            </form>

            <form className="flex flex-col gap:0.7em pb:1em">
              <h4 className="col-12 small mb-3 pt-3 border-top">Alarms</h4>

              <InputLabel
                value={waterContext.highLevelAlarm}
                label={"High Level Liters"}
              />
              <InputLabel
                value={waterContext.lowLevelAlarm}
                label={"Low Level Liters"}
              />
            </form>
          </div>
        </div>

        <button
          type={"button"}
          className="bg:blue-50 fg:white font:bold py:0.7em r:1.2em mx:1em mt:1em b:none"
        >
          Apply Changes
        </button>
      </div>
    </ContextRoot.Provider>
  );
}
