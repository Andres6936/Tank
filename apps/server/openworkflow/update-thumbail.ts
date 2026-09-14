import { z } from "zod";
import { renderPageAsImage } from "unpdf";
import { defineWorkflow } from "openworkflow";

// Note: OpenWorkflow not allow the path alias, workaround: use realtive imports
import { retrow, isError, unwrap } from "../src/utility/response";
import { getVaultsClients } from "../src/config/clients-vault";
import { optimizerImage } from "../src/utility/optimizer";

// Note: OpenWorkflow not allow the path alias, workaround: use realtive imports
import thumbnails from "../src/thumbnails/functions";
import documents from "../src/documents/functions";
import files from "../src/files/functions";

export const updateThumbail = defineWorkflow(
  {
    name: "update-thumbail",
    schema: z.object({
      DocumentId: z.uuid(),
    }),
  },
  async ({ input, step }) => {
    const result = await step.run({ name: "get-document" }, async () => {
      return await documents.getById(input.DocumentId);
    });
    if (isError(result)) return retrow(result);
    const { FileId } = unwrap(result);

    if (!FileId) {
      return {
        statusCode: 404,
        message: "File not associated with document",
      };
    }

    const resultFile = await step.run({ name: "get-file" }, async () => {
      return await files.getById(FileId);
    });
    if (isError(resultFile)) return retrow(resultFile);
    const file = unwrap(resultFile);

    const thumbnailBuffer = await step.run(
      { name: "get-thumbnail" },
      async () => {
        const { privateVault } = getVaultsClients();
        const buffer = await privateVault.file(file.Path).arrayBuffer();
        return await renderPageAsImage(buffer, 1, {
          canvasImport: () => import("@napi-rs/canvas"),
          scale: 0.5,
        });
      },
    );

    const { placeholder, optimize } = await step.run(
      { name: "optimize-thumbnail" },
      async () => {
        return await optimizerImage(thumbnailBuffer);
      },
    );

    const resultThumbnail = await step.run(
      { name: "save-or-update-thumbnail" },
      async () => {
        return await thumbnails.save({
          placeholder,
        });
      },
    );
    if (isError(resultThumbnail)) return retrow(resultThumbnail);

    await step.run({ name: "save-or-update-low-image" }, async () => {});

    return {
      statusCode: 200,
      message: "Success",
    };
  },
);
