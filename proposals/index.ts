import "konva/canvas-backend";
import { getBufferSeals } from "./pdf/utility/buffer-seals";

const buffers = await getBufferSeals({
  seal: "blue",
});

await Bun.write("out.png", buffers.seal);
