import React from "react";
import { svgToSvg } from "./from-svg";

const fromSvg = (svg: Element): React.JSX.Element => {
  if (!svg || svg.tagName !== "svg")
    throw new Error("Your element is not a svg element");

  return svgToSvg(svg);
};

export { fromSvg };
