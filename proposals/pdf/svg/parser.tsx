import { DOMParser } from "@xmldom/xmldom";
import { fromSvg as getNodes } from "./from-nodes";
import type { NodeProps } from "@react-pdf/renderer";

const fromSvg = (svg: string, properties?: NodeProps): React.JSX.Element => {
  const parser = new DOMParser();
  const node = parser.parseFromString(svg, "image/svg+xml").documentElement;

  if (!node || node.tagName !== "svg") {
    throw new Error("Invalid SVG");
  }

  return getNodes(node, properties);
};

export { fromSvg };
