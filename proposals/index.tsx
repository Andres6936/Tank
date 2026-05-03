import { qrcode, barcode } from "etiket";
import { fromSvg } from "./pdf/svg/parser";

import ReactPDF, { Document, Page } from "@react-pdf/renderer";

const url = "https://andres6936.dev/";

const svg = qrcode(url, {
  size: 500,
  color: {
    type: "linear",
    rotation: 45,
    stops: [
      { offset: 0, color: "#ff6b6b" },
      { offset: 1, color: "#73ff00" },
    ],
  },
  corners: {
    topLeft: {
      innerShape: "rounded",
      outerShape: "rounded",
    },
    topRight: {
      innerShape: "rounded",
      outerShape: "rounded",
    },
    bottomLeft: {
      innerShape: "rounded",
      outerShape: "rounded",
    },
  },
});

const bar = barcode(url, {});

// await Bun.write("etiket.svg", svg);
// await sharp("etiket.svg").png().toFile("etiket.png");

const nodes = fromSvg(svg);
const barNodes = fromSvg(bar);

const Leaf = () => (
  <Document>
    <Page size="A4">{nodes}</Page>
    <Page size="A4">{barNodes}</Page>
  </Document>
);

await ReactPDF.render(<Leaf />, "leaf.pdf");
