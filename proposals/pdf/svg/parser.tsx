import { DOMParser } from "@xmldom/xmldom";
import { fromSvg as getNodes } from "./from-nodes";

const fromSvg = (svg: string): React.JSX.Element => {
  const parser = new DOMParser();
  const node = parser.parseFromString(svg, "image/svg+xml").documentElement;

  if (!node || node.tagName !== "svg") {
    throw new Error("Invalid SVG");
  }

  return getNodes(node);
};

export { fromSvg };
