import { useContext } from "react";
import { IWaterContext, WaterContext } from "../context/WaterContext.tsx";
import IconFlower1 from "../icons/IconFlower1.tsx";
import { WaterLevel } from "../types/WaterLevel.ts";

interface Props {
  waterLevel: WaterLevel;
}

export default function InfoIcons(props: Props) {
  const waterContext = useContext<IWaterContext>(WaterContext);

  const formatWaterLevel = () =>
    new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(
      waterContext.waterLevel,
    );

  const getAnimationClass = () => {
    switch (props.waterLevel) {
      case "high":
        return "animation:rotate|1s|infinite|linear";
      case "medium":
        return "animation:rotate|3s|infinite|linear";
      case "low":
        return "animation:rotate|5s|infinite|linear";
    }
  };

  return (
    <div
      className={
        "flex flex-col align-items:center justify-center position:absolute w:5rem top:5 left:-5 gap:0.4em"
      }
    >
      <p
        className={
          "m:0 p:0 font-size:4em font:sans font:thin line-height:0.7em tracking:tighter"
        }
      >
        {formatWaterLevel()}
        <span className={"pl:0.1em font-size:0.3em"}>%</span>
      </p>

      <div
        className={
          "flex justify-content:center align-items:center b:2px|solid|gray w:3.2em square r:50%"
        }
      >
        <IconFlower1
          className={"opacity:0.6 " + getAnimationClass()}
          size={28}
        />
      </div>
    </div>
  );
}
