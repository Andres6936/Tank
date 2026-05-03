import React, { Fragment } from "react";
import {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  Polygon,
  Polyline,
  RadialGradient,
  Rect,
  Stop,
  Svg,
  Text,
} from "@react-pdf/renderer";
import type {
  SVGProps,
  LineProps,
  PolygonProps,
  PathProps,
  RectProps,
  CircleProps,
  EllipseProps,
  SVGTextProps,
  TspanProps,
  GProps,
  StopProps,
  ClipPathProps,
  LinearGradientProps,
  RadialGradientProps,
  PolylineProps,
} from "@react-pdf/renderer";
import { randomUUID } from "crypto";

import { attributeToNumber, cssToCamelCase } from "./attributes";

function isElement(node: ChildNode): node is Element {
  return node.nodeType === node.ELEMENT_NODE;
}

export const getChildren = (parent: Element): React.JSX.Element[] => {
  const children = [];

  // Iterate children
  for (let item of Array.from(parent.childNodes)) {
    if (!isElement(item)) continue;
    const type = item.tagName.toLowerCase();

    // Switch
    switch (type) {
      case "svg":
        children.push(fromSvg(item));
        break;
      case "line":
        children.push(fromLine(item));
        break;
      case "polyline":
        children.push(fromPolyline(item));
        break;
      case "polygon":
        children.push(fromPolygon(item));
        break;
      case "path":
        children.push(fromPath(item));
        break;
      case "rect":
        children.push(fromRect(item));
        break;
      case "circle":
        children.push(fromCircle(item));
        break;
      case "ellipse":
        children.push(fromEllipse(item));
        break;
      case "text":
        children.push(fromText(item));
        break;
      case "tspan":
        children.push(fromTspan(item, parent));
        break;
      case "g":
        children.push(fromG(item));
        break;
      case "stop":
        children.push(fromStop(item));
        break;
      case "defs":
        children.push(fromDefs(item));
        break;
      case "clippath":
        children.push(fromClipPath(item));
        break;
      case "lineargradient":
        children.push(fromLinearGradient(item));
        break;
      case "radialgradient":
        children.push(fromRadialGradient(item));
        break;
      default:
        console.error("Skip item", item);
        break;
    }
  }

  return children;
};

/**
 * SVG attributes
 */
export interface SVGAttribute {
  key: string;
  type: "string" | "number";
}

/**
 * Presentation attributes
 */
const presentationAttributes: SVGAttribute[] = [
  {
    key: "color",
    type: "string",
  },
  {
    key: "dominant-baseline",
    type: "string",
  },
  { key: "fill", type: "string" },
  { key: "fill-opacity", type: "number" },
  { key: "fill-rule", type: "string" },
  { key: "opacity", type: "number" },
  { key: "stroke", type: "string" },
  { key: "stroke-width", type: "number" },
  { key: "stroke-opacity", type: "number" },
  { key: "stroke-linecap", type: "string" },
  { key: "stroke-dasharray", type: "string" },
  { key: "transform", type: "string" },
  { key: "text-anchor", type: "string" },
  { key: "visibility", type: "string" },
];

/**
 * Get atrtibutes
 * @param item Item
 * @param attributes Attributes
 * @param props Props
 */
export const getAttributes = (
  item: Element,
  attributes: SVGAttribute[],
  props: any,
): void => {
  attributes.forEach((attribute) => {
    let value = item.getAttribute(attribute.key);

    // BUG wrong formatting of stroke-dasharray: "3 3" instead of stroke-dasharray: "3, 3"
    if (attribute.key === "stroke-dasharray" && value)
      value = value.split(" ").join(", ");

    if (value) {
      const key = cssToCamelCase(attribute.key);
      if (attribute.type === "number")
        props[key] = attributeToNumber(item, value);
      else props[key] = value;
    }
  });
};

/**
 * Get presentation attributes
 * @param item Item
 * @param props Props
 */
export const getPresentationAtributes = (item: Element, props: any): void => {
  getAttributes(item, presentationAttributes, props);
};

export const fromSvg = (item: Element): React.JSX.Element => {
  const props: SVGProps & { key: string } = { key: randomUUID() };
  getAttributes(
    item,
    [
      { key: "width", type: "number" },
      { key: "height", type: "number" },
      { key: "viewBox", type: "string" },
      { key: "preserveAspectRatio", type: "string" },
    ],
    props,
  );

  return <Svg {...props}>{getChildren(item)}</Svg>;
};

/**
 * line to Line
 * @param item Item
 * @returns Line
 */
export const fromLine = (item: Element): React.JSX.Element => {
  const props: LineProps & { key: string } = {
    key: randomUUID(),
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
  };
  getPresentationAtributes(item, props);
  getAttributes(
    item,
    [
      { key: "x1", type: "number" },
      { key: "x2", type: "number" },
      { key: "y1", type: "number" },
      { key: "y2", type: "number" },
    ],
    props,
  );

  return <Line {...props}>{getChildren(item)}</Line>;
};

/**
 * polyline to Polyline
 * @param item Item
 * @returns Polyline
 */
export const fromPolyline = (item: Element): React.JSX.Element => {
  const props: PolylineProps & { key: string } = {
    key: randomUUID(),
    points: "",
  };
  getPresentationAtributes(item, props);
  getAttributes(item, [{ key: "points", type: "string" }], props);

  return <Polyline {...props}>{getChildren(item)}</Polyline>;
};

/**
 * polygon to Polygon
 * @param item Item
 * @returns Polygon
 */
export const fromPolygon = (item: Element): React.JSX.Element => {
  const props: PolygonProps & { key: string } = {
    key: randomUUID(),
    points: "",
  };
  getPresentationAtributes(item, props);
  getAttributes(item, [{ key: "points", type: "string" }], props);

  return <Polygon {...props}>{getChildren(item)}</Polygon>;
};

/**
 * path To Path
 * @param item Item
 * @returns Path
 */
export const fromPath = (item: Element): React.JSX.Element => {
  const props: PathProps & { key: string } = { key: randomUUID(), d: "" };
  getPresentationAtributes(item, props);
  getAttributes(item, [{ key: "d", type: "string" }], props);

  if (!props.fill) props.fill = "#abc";

  return <Path {...props}>{getChildren(item)}</Path>;
};

/**
 * rect to Rect
 * @param item Item
 * @returns Rect
 */
export const fromRect = (item: Element): React.JSX.Element => {
  const props: RectProps & { key: string } = {
    key: randomUUID(),
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };
  getPresentationAtributes(item, props);
  getAttributes(
    item,
    [
      { key: "x", type: "number" },
      { key: "y", type: "number" },
      { key: "width", type: "number" },
      { key: "height", type: "number" },
      { key: "rx", type: "number" },
      { key: "ry", type: "number" },
    ],
    props,
  );

  return <Rect {...props}>{getChildren(item)}</Rect>;
};

/**
 * circle to Circle
 * @param item Item
 * @returns Circle
 */
export const fromCircle = (item: Element): React.JSX.Element => {
  const props: CircleProps & { key: string } = {
    key: randomUUID(),
    cx: 0,
    cy: 0,
    r: 0,
  };
  getPresentationAtributes(item, props);
  getAttributes(
    item,
    [
      { key: "cx", type: "number" },
      { key: "cy", type: "number" },
      { key: "r", type: "number" },
    ],
    props,
  );

  return <Circle {...props}>{getChildren(item)}</Circle>;
};

/**
 * ellipse to Ellipse
 * @param item Item
 * @returns Ellipse
 */
export const fromEllipse = (item: Element): React.JSX.Element => {
  const props: EllipseProps & { key: string } = {
    key: randomUUID(),
    cx: 0,
    cy: 0,
    rx: 0,
    ry: 0,
  };
  getPresentationAtributes(item, props);
  getAttributes(
    item,
    [
      { key: "cx", type: "number" },
      { key: "cy", type: "number" },
      { key: "rx", type: "number" },
      { key: "ry", type: "number" },
    ],
    props,
  );

  return <Ellipse {...props}>{getChildren(item)}</Ellipse>;
};

/**
 * text to Text
 * @param item Item
 * @returns Text
 */
export const fromText = (item: Element): React.JSX.Element => {
  const props: SVGTextProps & { key: string } = {
    key: randomUUID(),
    x: 0,
    y: 0,
  };
  getPresentationAtributes(item, props);
  getAttributes(
    item,
    [
      { key: "x", type: "number" },
      { key: "y", type: "number" },
      { key: "width", type: "number" },
      { key: "height", type: "number" },
    ],
    props,
  );

  const children = Array.from(item.children);
  if (children.length) {
    const texts: React.JSX.Element[] = [];
    for (const child of children) {
      texts.push(fromTspan(child, item));
    }
    return <Fragment key={randomUUID()}>{texts}</Fragment>;
  } else {
    return <Text {...props}>{item.innerHTML}</Text>;
  }
};

/**
 * tspan to Tspan
 * @param item Item
 * @returns Tspan
 */
export const fromTspan = (
  item: Element,
  parent: Element,
): React.JSX.Element => {
  const props: TspanProps & { dx?: number; dy?: number } = {
    x: 0,
    y: 0,
  };
  getPresentationAtributes(item, props);
  getAttributes(
    item,
    [
      { key: "x", type: "number" },
      { key: "y", type: "number" },
      { key: "dx", type: "number" },
      { key: "dy", type: "number" },
    ],
    props,
  );

  const parentProps: SVGTextProps & { key: string } = {
    key: randomUUID(),
    x: 0,
    y: 0,
  };
  getPresentationAtributes(parent, parentProps);
  getAttributes(
    parent,
    [
      { key: "x", type: "number" },
      { key: "y", type: "number" },
    ],
    parentProps,
  );

  parentProps.x = +parentProps.x + (props.dx ?? 0);
  parentProps.y = +parentProps.y + (props.dy ?? 0);

  return <Text {...parentProps}>{item.innerHTML}</Text>;
};

/**
 * g to G
 * @param item Item
 * @returns G
 */
export const fromG = (item: Element): React.JSX.Element => {
  const props: GProps & { key: string } = { key: randomUUID() };
  getPresentationAtributes(item, props);

  return <G {...props}>{getChildren(item)}</G>;
};

/**
 * stop to Stop
 * @param item Item
 * @returns Stop
 */
export const fromStop = (item: Element): React.JSX.Element => {
  const props: StopProps & { key: string } = {
    key: randomUUID(),
    offset: 0,
    stopColor: "",
  };
  getAttributes(
    item,
    [
      { key: "offset", type: "number" },
      { key: "stop-color", type: "string" },
      { key: "stop-opacity", type: "number" },
    ],
    props,
  );

  return <Stop {...props}>{getChildren(item)}</Stop>;
};

/**
 * defs to Defs
 * @param item Item
 * @returns Defs
 */
export const fromDefs = (item: Element): React.JSX.Element => {
  const props = { key: randomUUID() };

  return <Defs {...props}>{getChildren(item)}</Defs>;
};

/**
 * clipPath to ClipPath
 * @param item Item
 * @returns ClipPath
 */
export const fromClipPath = (item: Element): React.JSX.Element => {
  const props: ClipPathProps & { key: string } = { key: randomUUID() };

  return <ClipPath {...props}>{getChildren(item)}</ClipPath>;
};

/**
 * linearGradient to LinearGradient
 * @param item Item
 * @returns LinearGradient
 */
export const fromLinearGradient = (item: Element): React.JSX.Element => {
  const props: LinearGradientProps & { key: string } = {
    key: randomUUID(),
    id: "",
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
  };
  getAttributes(
    item,
    [
      { key: "id", type: "string" },
      { key: "x1", type: "number" },
      { key: "x2", type: "number" },
      { key: "y1", type: "number" },
      { key: "y2", type: "number" },
    ],
    props,
  );

  return <LinearGradient {...props}>{getChildren(item)}</LinearGradient>;
};

/**
 * radialgradient to RadialGradient
 * @param item Item
 * @returns RadialGradient
 */
export const fromRadialGradient = (item: Element): React.JSX.Element => {
  const props: RadialGradientProps & { key: string } = {
    key: randomUUID(),
    id: "",
    cx: 0,
    cy: 0,
    fr: 0,
    fx: 0,
    fy: 0,
  };
  getPresentationAtributes(item, props);
  getAttributes(
    item,
    [
      { key: "id", type: "string" },
      { key: "cx", type: "number" },
      { key: "cy", type: "number" },
      { key: "fr", type: "number" },
      { key: "fx", type: "number" },
      { key: "fy", type: "number" },
    ],
    props,
  );

  return <RadialGradient {...props}>{getChildren(item)}</RadialGradient>;
};
