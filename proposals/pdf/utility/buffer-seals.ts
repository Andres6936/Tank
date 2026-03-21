import sharp from "sharp";
import QRCode from "qrcode";
import barcode from "jsbarcode";
import { Canvas } from "canvas";

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
  const codeBuffer = await QRCode.toDataURL("https://andres6936.dev/", {
    quality: 1,
    margin: 0,
    color: {
      dark: "#f8f4e3",
      light: "#00000000",
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
    code: codeBuffer.slice(22),
    text: buffer.slice(22),
    barcode: canvas.toBuffer().toBase64(),
  };
};

export { getBufferSeals };
