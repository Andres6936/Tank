import { qrcode, barcode } from "etiket";

import {
  getCircleTextBuffer,
  getConsecutiveUUID,
} from "~/pdf/utility/graphics";

const TypeSeals = {
  red: {
    path: "./public/seals/seal-red.png",
  },
  green: {
    path: "./public/seals/seal-green.png",
  },
  blue: {
    path: "./public/seals/seal-blue.png",
  },
} as const;

type TypeSealsKey = keyof typeof TypeSeals;

const getSealFile = (seal: TypeSealsKey) => {
  switch (seal) {
    case "red":
      return Bun.file(TypeSeals.red.path);
    case "green":
      return Bun.file(TypeSeals.green.path);
    case "blue":
      return Bun.file(TypeSeals.blue.path);
    default:
      return Bun.file("./public/seals/seal-red.png");
  }
};

const payload =
  "00020101021126320014CO.COM.RBM.LLA0110114399547349250014CO.COM.RBM.RED0103RBM50290013CO.COM.RBM.CU01080000000051220013CO.COM.RBM.CA010105204000053031705802CO59010600106101062290712CC1143995473080200110363180270016CO.COM.RBM.CANAL0103APP81250015CO.COM.RBM.CIVA01020282260014CO.COM.RBM.IVA01040.0083270015CO.COM.RBM.BASE01040.0084250015CO.COM.RBM.CINC01020285260014CO.COM.RBM.INC01040.0090430016CO.COM.RBM.TRXID0119000001WwqxPWELOlRbd91460014CO.COM.RBM.SEC0124JvbRHqZxAxhOP3DBJnT53lE7630430A8";

const getBreBCode = () => {
  const codeSvg = qrcode(payload, {
    margin: 0,
    color: "#14192f",
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

  return codeSvg;
};

const getBufferSeals = async ({
  seal = "red",
}: { seal?: TypeSealsKey } = {}) => {
  const uuid = getConsecutiveUUID();
  const buffer = getCircleTextBuffer(uuid.long);

  const sealFile = getSealFile(seal);
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
    margin: 0,
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

export { getBreBCode, getBufferSeals, type TypeSealsKey };
