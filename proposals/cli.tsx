import ReactPDF from "@react-pdf/renderer";

// Argument Parser
import { object } from "@optique/core/constructs";
import { option } from "@optique/core/primitives";
import { path } from "@optique/run/valueparser";
import { run } from "@optique/run";

// Utility Seals Buffers
import { getBufferSeals } from "~/pdf/utility/buffer-seals";

// Tempaltes
import { run as proposal } from "~/pdf/templates/proposal";

const parser = object({
  file: option(
    "--file",
    path({
      mustExist: true,
      type: "file",
    }),
  ),
});

const config = run(parser, {
  args: Bun.argv.slice(2),
});

(async () => {
  const file = config.file;
  const buffers = await getBufferSeals({
    seal: "blue",
  });
  const document = await proposal({ file, buffers });
  ReactPDF.render(document, `./book-x.pdf`);
})();
