import {createContext, ReactNode, useState} from "react";

export interface IWaterContext {
    waterLevel: number,
    maximumLevel: number,
    minimumLevel: number,
    setWaterLevel: (value: number) => void,
    setMaximumLevel: (value: number) => void,
    setMinimumLevel: (value: number) => void,
    incrementWaterLevel: () => void,
    decrementWaterLevel: () => void,
}

export const WaterContext = createContext<IWaterContext>({
    waterLevel: 0,
    maximumLevel: 500,
    minimumLevel: 50,
    setWaterLevel: () => console.log("Not Implemented"),
    setMaximumLevel: () => console.log("Not Implemented"),
    setMinimumLevel: () => console.log("Not Implemented"),
    incrementWaterLevel: () => console.log("Not Implemented"),
    decrementWaterLevel: () => console.log("Not Implemented"),
})


export default function WaterContextProvider (props: {children: ReactNode}) {
    const [waterLevel, setWaterLevel] = useState<number>(50)
    const [maximumLevel, setMaximumLevel] = useState<number>(500);
    const [minimumLevel, setMinimumLevel] = useState<number>(50);
    
    const incrementWaterLevel = () => setWaterLevel(waterLevel + 10);
    
    const decrementWaterLevel = () => setWaterLevel(waterLevel - 10);
    
    return (
        <WaterContext.Provider value={{
            waterLevel,
            maximumLevel,
            minimumLevel,
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