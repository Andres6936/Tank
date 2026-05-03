import ReactPDF from "@react-pdf/renderer";

// Argument Parser
import { optional, withDefault, map } from "@optique/core/modifiers";
import { object } from "@optique/core/constructs";
import { option } from "@optique/core/primitives";
import { string, choice } from "@optique/core/valueparser";
import { path } from "@optique/run/valueparser";
import { run } from "@optique/run";

// Utility Seals Buffers
import { getBufferSeals } from "~/pdf/utility/buffer-seals";

// Tempaltes
import { run as proposal } from "~/pdf/templates/proposal";

const parser = object({
  file: option(
    "-f",
    "--file",
    path({
      mustExist: true,
      type: "file",
    }),
  ),
  seal: withDefault(
    optional(option("-s", "--seal", choice(["blue", "red", "green"]))),
    "blue",
  ),
  output: withDefault(option("-o", "--output", string()), "./output.pdf"),
});

const config = run(parser, {
  args: Bun.argv.slice(2),
});

(async () => {
  const { file, seal, output } = config;
  const buffers = await getBufferSeals({
    seal,
  });
  const document = await proposal({ file, buffers });
  ReactPDF.render(document, output);
})();
