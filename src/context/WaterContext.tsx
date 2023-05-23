import {createContext, ReactNode, useState} from "react";

export interface IWaterContext {
    waterLevel: number,
    maximumLevel: number,
    minimumLevel: number,
    lowLevelAlarm: number,
    highLevelAlarm: number,
    setWaterLevel: (value: number) => void,
    setMaximumLevel: (value: number) => void,
    setMinimumLevel: (value: number) => void,
    incrementWaterLevel: () => void,
    decrementWaterLevel: () => void,
}

export const WaterContext = createContext<IWaterContext>({
    waterLevel: 50,
    maximumLevel: 100,
    minimumLevel: 0,
    lowLevelAlarm: 25,
    highLevelAlarm: 80,
    setWaterLevel: () => console.log("Not Implemented"),
    setMaximumLevel: () => console.log("Not Implemented"),
    setMinimumLevel: () => console.log("Not Implemented"),
    incrementWaterLevel: () => console.log("Not Implemented"),
    decrementWaterLevel: () => console.log("Not Implemented"),
})


export default function WaterContextProvider (props: {children: ReactNode}) {
    const [waterLevel, setWaterLevel] = useState<number>(50)
    const [maximumLevel, setMaximumLevel] = useState<number>(100);
    const [minimumLevel, setMinimumLevel] = useState<number>(0);
    const [lowLevelAlarm, setLowLevelAlarm] = useState<number>(25);
    const [highLevelAlarm, setHighLevelAlarm] = useState<number>(80);
    
    const incrementWaterLevel = () => setWaterLevel(waterLevel + 5);
    
    const decrementWaterLevel = () => setWaterLevel(waterLevel - 5);
    
    return (
        <WaterContext.Provider value={{
            waterLevel,
            maximumLevel,
            minimumLevel,
            lowLevelAlarm,
            highLevelAlarm,
            setWaterLevel,
            setMaximumLevel,
            setMinimumLevel,
            incrementWaterLevel,
            decrementWaterLevel,
        }}>
            {props.children}
        </WaterContext.Provider>
    )
}