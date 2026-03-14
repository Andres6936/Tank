import type { NodeProps } from "@react-pdf/renderer";

type StylesNode = NodeProps["style"];

const mergeStyles = <T>(to: T, from: T): StylesNode => {
  const toStyles = to ? (Array.isArray(to) ? to : [to]) : [];
  const fromStyles = from ? (Array.isArray(from) ? from : [from]) : [];

  return [...toStyles, ...fromStyles];
};

export { mergeStyles };

export type { StylesNode };
