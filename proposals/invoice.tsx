import ReactPDF from "@react-pdf/renderer";

// Argument Parser
import { optional, withDefault, map } from "@optique/core/modifiers";
import { string, choice } from "@optique/core/valueparser";
import { message } from "@optique/core/message";
import { object } from "@optique/core/constructs";
import { option } from "@optique/core/primitives";
import { run, print } from "@optique/run";
import { path } from "@optique/run/valueparser";

// Tempaltes
import { run as invoice, transform } from "~/pdf/templates/invoice";

const parser = object({
  input: option(
    "-i",
    "--input",
    path({
      mustExist: true,
      type: "directory",
    }),
  ),
  seal: withDefault(
    option("-s", "--seal", choice(["blue", "red", "green"])),
    "red",
  ),
  output: withDefault(
    option("-o", "--output", path({ type: "file" })),
    "./output.pdf",
  ),
});

const config = run(parser, {
  args: Bun.argv.slice(2),
});

(async () => {
  const { output } = config;
  const { xml, paths, breBCode, buffers } = await transform(config);

  const document = await invoice({ xml, breBCode, buffers });
  ReactPDF.render(document, output);
  await Bun.write(paths.reference, xml);

  print(message`Document generated successfully to ${output}`);
})();
