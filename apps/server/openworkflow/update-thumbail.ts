import { z } from "zod";
import { renderPageAsImage } from "unpdf";
import { defineWorkflow } from "openworkflow";

import { retrow, isError, unwrap } from "~/utility/response";

import thumbnails from "~/thumbnails/functions";
import documents from "~/documents/functions";
import files from "~/files/functions";

import { getVaultsClients } from "~/config/clients-vault";

const { privateVault } = getVaultsClients();

export const updateThumbail = defineWorkflow(
  {
    name: "update-thumbail",
    schema: z.object({
      DocumentId: z.uuid(),
    }),
  },
  async ({ input, step }) => {
    const result = await step.run({ name: "get-document" }, () => {
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

    const resultFile = await step.run({ name: "get-file" }, () => {
      return await files.getById(FileId);
    });
    if (isError(resultFile)) return retrow(resultFile);
    const file = unwrap(resultFile);

    const thumbnailBuffer = await step.run({ name: "get-thumbnail" }, () => {
      const buffer = await privateVault.file(file.Path).arrayBuffer();
      return await renderPageAsImage(buffer, 1, {
        canvasImport: () => import("@napi-rs/canvas"),
        scale: 0.5,
      });
    });

    const { placeholder, optimize } = await step.run(
      { name: "optimize-thumbnail" },
      () => {
        const image = new Bun.Image(thumbnailBuffer);
        const placeholder = await image.placeholder();
        const optimize = await image.webp({ quality: 80 }).buffer();

        return {
          placeholder,
          optimize,
        };
      },
    );

    const resultThumbnail = await step.run(
      { name: "save-or-update-thumbnail" },
      () => {
        return await thumbnails.save({
          placeholder,
        });
      },
    );
    if (isError(resultThumbnail)) return retrow(resultThumbnail);

    await step.run({ name: "save-or-update-low-image" }, () => {});

    return {
      statusCode: 200,
      message: "Success",
    };
  },
);
