import {createContext, ReactNode, useState} from "react";

export interface IWaterContext {
    waterLevel: number
    incrementWaterLevel: () => void,
    decrementWaterLevel: () => void,
}

export const WaterContext = createContext<IWaterContext>({
    waterLevel: 0,
    incrementWaterLevel: () => console.log("Not Implemented"),
    decrementWaterLevel: () => console.log("Not Implemented"),
})


export default function WaterContextProvider (props: {children: ReactNode}) {
    const [waterLevel, setWaterLevel] = useState<number>(0)
    
    const incrementWaterLevel = () => setWaterLevel(waterLevel + 10);
    
    const decrementWaterLevel = () => setWaterLevel(waterLevel - 10);
    
    return (
        <WaterContext.Provider value={{
            waterLevel,
            incrementWaterLevel,
            decrementWaterLevel,
        }}>
            {props.children}
        </WaterContext.Provider>
    )
}