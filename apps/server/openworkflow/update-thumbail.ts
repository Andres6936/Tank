import { z } from "zod";
import path from "node:path";
import { renderPageAsImage } from "unpdf";
import { defineWorkflow } from "openworkflow";

import { retrow, isError, unwrap } from "~/utility/response";
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
    const { FileId, ThumbnailId } = unwrap(result);

    if (!FileId) {
      return {
        statusCode: 404,
        message: "File not associated with document",
      };
    }

    const resultFile = await step.run({ name: "get-file" }, async () => {
      return await files.private.getById(FileId);
    });
    if (isError(resultFile)) return retrow(resultFile);
    const file = unwrap(resultFile);

    const resultThumbnail = await step.run(
      { name: "get-thumbnail" },
      async () => {
        const resultBuffer = await files.private.getBufferByPath(file.Path);
        if (isError(resultBuffer)) return retrow(resultBuffer);
        const buffer = unwrap(resultBuffer);
        const thumbnail = await renderPageAsImage(buffer, 1, {
          canvasImport: () => import("@napi-rs/canvas"),
          scale: 0.5,
        });
        const { placeholder, optimize } = await optimizerImage(thumbnail);

        // If exist thumbail, update it, otherwise save a new one
        if (ThumbnailId) {
          const dirname = path.dirname(file.Path);
          const name = path.basename(file.Path, path.extname(file.Path));
          const pathname = path.join("/Thumbnails/", dirname, name, "Low.webp");

          const resultSaveThumbnail = await files.public.save({
            Path: pathname,
            Blob: optimize,
          });
          if (isError(resultSaveThumbnail)) return retrow(resultSaveThumbnail);
          const { Id } = unwrap(resultSaveThumbnail);

          return await thumbnails.update({
            id: ThumbnailId,
            placeholder,
            lowFileId: Id,
          });
        } else {
          const resultSaveThumbnail = await thumbnails.save({
            placeholder,
          });
          if (isError(resultSaveThumbnail)) return retrow(resultSaveThumbnail);
          const { Id } = unwrap(resultSaveThumbnail);
          return await documents.updateThumbail({
            Id: input.DocumentId,
            ThumbnailId: Id,
          });
        }
      },
    );
    if (isError(resultThumbnail)) return retrow(resultThumbnail);

    return {
      statusCode: 200,
      message: "Success",
    };
  },
);
