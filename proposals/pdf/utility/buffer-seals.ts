import { qrcode, barcode } from "etiket";

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
  const codeSvg = qrcode("https://andres6936.dev/", {
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

  const barcodeSvg = barcode(uuid.short, {
    height: 50,
    background: "#00000000",
    color: "#14192f",
    showText: false,
  });

  return {
    uuid,
    seal: sealBuffer.toBase64(),
    // Remove the first 22 characters, equivalent to: << data:image/png;base64, >>
    text: buffer.slice(22),
    code: codeSvg,
    barcode: barcodeSvg,
  };
};

export { getBufferSeals };
