import barcode from "jsbarcode";
import { Canvas } from "canvas";
import { qrcode } from "etiket";

import {
  getCircleTextBuffer,
  getConsecutiveUUID,
} from "~/pdf/utility/graphics";

const getSealFile = (seal: string) => {
  switch (seal) {
    case "red":
      return Bun.file("./public/seals/seal-red.png");
    case "green":
      return Bun.file("./public/seals/seal-green.png");
    case "blue":
      return Bun.file("./public/seals/seal-blue.png");
    default:
      return Bun.file("./public/seals/seal-red.png");
  }
};

const getBufferSeals = async (args?: { seal?: "red" | "green" | "blue" }) => {
  const uuid = getConsecutiveUUID();
  const buffer = getCircleTextBuffer(uuid.long);

  const sealFile = getSealFile(args?.seal ?? "red");
  const sealBuffer = Buffer.from(await sealFile.bytes());
  const svg = qrcode("https://andres6936.dev/", {
    margin: 0,
    color: "#f8f4e3",
    background: "#00000000",
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

  const canvas = new Canvas(550, 550);
  barcode(canvas, uuid.short, {
    height: 50,
    background: "#f8f4e3",
    lineColor: "#14192f",
    displayValue: false,
  });

  return {
    uuid,
    seal: sealBuffer.toBase64(),
    // Remove the first 22 characters, equivalent to: << data:image/png;base64, >>
    code: svg,
    text: buffer.slice(22),
    barcode: canvas.toBuffer().toBase64(),
  };
};

export { getBufferSeals };
