import { z } from "zod";
import { renderPageAsImage } from "unpdf";
import { defineWorkflow } from "openworkflow";

import { retrow, isError, unwrap } from "~/utility/response";
import { getVaultsClients } from "~/config/clients-vault";
import { optimizerImage } from "~/utility/optimizer";

import thumbnails from "~/thumbnails/functions";
import documents from "~/documents/functions";
import files from "~/files/functions";

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

    const resultThumbnail = await step.run(
      { name: "get-thumbnail" },
      async () => {
        const { privateVault } = getVaultsClients();
        const buffer = await privateVault.file(file.Path).arrayBuffer();
        const thumbnailBuffer = await renderPageAsImage(buffer, 1, {
          canvasImport: () => import("@napi-rs/canvas"),
          scale: 0.5,
        });
        const { placeholder, optimize } = await optimizerImage(thumbnailBuffer);
        return await thumbnails.save({
          placeholder,
        });
      },
    );
    if (isError(resultThumbnail)) return retrow(resultThumbnail);

    return {
      statusCode: 200,
      message: "Success",
    };
  },
);
