import ReactPDF from "@react-pdf/renderer";

// Bun/Node Utility
import * as pathSystem from "node:path";

// Argument Parser
import { optional, withDefault, map } from "@optique/core/modifiers";
import { string, choice } from "@optique/core/valueparser";
import { message } from "@optique/core/message";
import { object } from "@optique/core/constructs";
import { option } from "@optique/core/primitives";
import { run, print } from "@optique/run";
import { path } from "@optique/run/valueparser";

// Utility Seals Buffers
import { getBufferSeals } from "~/pdf/utility/buffer-seals";

// Formatters
import { formatMoney, formatSpanishDate } from "~/lib/utils";

// Tempaltes
import { run as invoice } from "~/pdf/templates/invoice";

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
    optional(option("-s", "--seal", choice(["blue", "red", "green"]))),
    "blue",
  ),
  output: withDefault(
    option("-o", "--output", path({ type: "file" })),
    "./output.pdf",
  ),
});

type ParameterType =
  | { Key: string; Type: "String"; Value: string }
  | { Key: string; Type: "Number"; Value: number };

type ParamsFileType = {
  Date: string;
  AccountNumber: number;
  Value: number;
  Currency: string;
  Parameters: ParameterType[];
};

const config = run(parser, {
  args: Bun.argv.slice(2),
});

(async () => {
  const { input, seal, output } = config;
  const inputDirectory = input;

  const paths = {
    template: pathSystem.join(inputDirectory, "index.xml"),
    parameters: pathSystem.join(inputDirectory, "index.json"),
    pdf: pathSystem.join(inputDirectory, "index.pdf"),
    reference: pathSystem.join(inputDirectory, "reference.xml"),
  };

  const [content, params, buffers] = await Promise.all([
    Bun.file(paths.template).text(),
    Bun.file(paths.parameters).json(),
    getBufferSeals({
      seal,
    }),
  ]);

  const valueSpeech =
    "Un millón cuatrocientos ochenta mil ciento sesenta y seis pesos colombianos";
  let parsed = content
    .replaceAll("{{UUID.Short}}", buffers.uuid.short)
    .replaceAll("{{UUID.Long}}", buffers.uuid.long)
    .replaceAll("{{Value}}", formatMoney(params.Value, params.Currency))
    .replaceAll("{{Currency}}", params.Currency)
    .replaceAll("{{Value.Speech}}", valueSpeech)
    .replaceAll(
      "{{AccountNumber}}",
      `x${Number(params.AccountNumber).toString(16).toUpperCase()}`,
    )
    .replaceAll("{{Date}}", params.Date)
    .replaceAll("{{Date.Speech}}", formatSpanishDate(params.Date));

  for (let parameter of (params as ParamsFileType).Parameters) {
    if (parameter.Type === "String") {
      parsed = parsed.replaceAll(`{{${parameter.Key}}}`, parameter.Value);
    } else if (parameter.Type === "Number") {
      parsed = parsed.replaceAll(
        `{{${parameter.Key}}}`,
        parameter.Value.toString(),
      );
    }
  }

  const document = await invoice({ xml: parsed, buffers });
  ReactPDF.render(document, output);
  await Bun.write(paths.reference, parsed);

  print(message`Document generated successfully to ${output}`);
})();
