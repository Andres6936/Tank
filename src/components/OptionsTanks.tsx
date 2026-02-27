import React, { useContext, useState } from "react";
import InputLabel from "./input/InputLabel.tsx";
import { IWaterContext, WaterContext } from "../context/WaterContext.tsx";

type ContextRootProps = {
  isDirty: boolean;
  maximumLevel: number;
  onChangeMaximumLevel: (value: number) => void;
  minimumLevel: number;
  onChangeMinimumLevel: (value: number) => void;
  highLevelAlarm: number;
  onChangeHighLevelAlarm: (value: number) => void;
  lowLevelAlarm: number;
  onChangeLowLevelAlarm: (value: number) => void;
  onApplyChanges: () => void;
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

const FieldHighLevelLeters = () => {
  const { highLevelAlarm, onChangeHighLevelAlarm } = useContextRoot();

  return (
    <InputLabel
      value={highLevelAlarm}
      onChange={(e) => onChangeHighLevelAlarm(e.target.valueAsNumber)}
      label={"High Level Liters"}
    />
  );
};

const FieldLowLevelLeters = () => {
  const { lowLevelAlarm, onChangeLowLevelAlarm } = useContextRoot();

  return (
    <InputLabel
      value={lowLevelAlarm}
      onChange={(e) => onChangeLowLevelAlarm(e.target.valueAsNumber)}
      label={"Low Level Liters"}
    />
  );
};

const ActionApply = () => {
  const { isDirty, onApplyChanges } = useContextRoot();

  return (
    <button
      type={"button"}
      disabled={!isDirty}
      onClick={onApplyChanges}
      className="bg:blue-50 fg:white font:bold py:0.7em r:1.2em mx:1em mt:1em b:none opacity:.7:disabled"
    >
      Apply Changes
    </button>
  );
};

export default function OptionsTanks() {
  const waterContext = useContext<IWaterContext>(WaterContext);

  const [maximumLevel, setMaximumLevel] = useState(waterContext.maximumLevel);
  const [minimumLevel, setMinimumLevel] = useState(waterContext.minimumLevel);
  const [highLevelAlarm, setHighLevelAlarm] = useState(
    waterContext.highLevelAlarm,
  );
  const [lowLevelAlarm, setLowLevelAlarm] = useState(
    waterContext.lowLevelAlarm,
  );

  const onApplyChanges = () => {
    waterContext.setMaximumLevel(maximumLevel);
    waterContext.setMinimumLevel(minimumLevel);
    waterContext.setHighLevelAlarm(highLevelAlarm);
    waterContext.setLowLevelAlarm(lowLevelAlarm);
  };

  const isDirty =
    maximumLevel !== waterContext.maximumLevel ||
    minimumLevel !== waterContext.minimumLevel ||
    highLevelAlarm !== waterContext.highLevelAlarm ||
    lowLevelAlarm !== waterContext.lowLevelAlarm;

  return (
    <ContextRoot.Provider
      value={{
        isDirty,
        maximumLevel,
        onChangeMaximumLevel: setMaximumLevel,
        minimumLevel,
        onChangeMinimumLevel: setMinimumLevel,
        highLevelAlarm,
        onChangeHighLevelAlarm: setHighLevelAlarm,
        lowLevelAlarm,
        onChangeLowLevelAlarm: setLowLevelAlarm,
        onApplyChanges,
      }}
    >
      <div className="flex flex-col flex-shrink:0  flex-basis:99.3%@xs flex-basis:50%@sm flex-basis:32.5%@md ">
        <div className=" r:1em b:1px|solid|#CCC px:2em py:1em  mb:2em h:100%">
          <div className="flex flex-col">
            <form className="flex flex-col gap:0.7em pb:1em">
              <h4 className="col-12 small mb-3 font:semibold pt-3">Capacity</h4>
              <FieldMaximumLiters />
              <FieldMinimumLiters />
            </form>

            <form className="flex flex-col gap:0.7em pb:1em">
              <h4 className="col-12 small mb-3 pt-3 font:semibold border-top">
                Alarms
              </h4>
              <FieldHighLevelLeters />
              <FieldLowLevelLeters />
            </form>
          </div>
        </div>

        <ActionApply />
      </div>
    </ContextRoot.Provider>
  );
}
