import ReactPDF from "@react-pdf/renderer";

// Argument Parser
import { optional, withDefault, map } from "@optique/core/modifiers";
import { string, choice } from "@optique/core/valueparser";
import { message } from "@optique/core/message";
import { object, or } from "@optique/core/constructs";
import { option, command, constant } from "@optique/core/primitives";
import { run, print } from "@optique/run";
import { path } from "@optique/run/valueparser";

// Utility Seals Buffers
import { getBufferSeals } from "~/pdf/utility/buffer-seals";

// Templates
import { run as proposal } from "~/pdf/templates/proposal";
import { run as invoice, transform } from "~/pdf/templates/invoice";

const parser = or(
  command(
    "proposal",
    object({
      type: constant("proposal"),
      file: option(
        "-f",
        "--file",
        path({
          mustExist: true,
          type: "file",
        }),
      ),
      seal: withDefault(
        option("-s", "--seal", choice(["blue", "red", "green"])),
        "blue",
      ),
      output: withDefault(
        option("-o", "--output", path({ type: "file" })),
        "./output.pdf",
      ),
    }),
  ),
  command(
    "invoice",
    object({
      type: constant("invoice"),
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
    }),
  ),
);

const config = run(parser, {
  args: Bun.argv.slice(2),
});

(async () => {
  if (config.type === "proposal") {
    const { file, seal, output } = config;
    const buffers = await getBufferSeals({
      seal,
    });
    const document = await proposal({ file, buffers });
    ReactPDF.render(document, output);
  }

  if (config.type === "invoice") {
    const { output } = config;
    const { xml, paths, breBCode, buffers } = await transform(config);

    const document = await invoice({ xml, breBCode, buffers });
    ReactPDF.render(document, output);
    await Bun.write(paths.reference, xml);
  }

  print(message`Document generated successfully to ${config.output}`);
})();
