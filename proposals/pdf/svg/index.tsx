import React from "react";
import { Svg, type SVGProps } from "@react-pdf/renderer";
import { getAttributes, getChildren } from "./from-svg";

/**
 * svg to Svg
 * @param svg SVG
 * @returns ReactPDF Svg
 */
const fromSvg = (svg: SVGElement): React.JSX.Element => {
  if (!svg || svg.tagName !== "svg")
    throw new Error("Your element is not a svg element");

  // Props
  const props: SVGProps = {};
  getAttributes(
    svg,
    [
      { key: "width", type: "number" },
      { key: "height", type: "number" },
      { key: "viewBox", type: "string" },
      { key: "preserveAspectRatio", type: "number" },
    ],
    props,
  );

  /**
   * Render
   */
  return <Svg {...props}>{getChildren(svg)}</Svg>;
};

export { fromSvg };
