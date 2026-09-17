import { z } from "zod";
import path from "node:path";
import { renderPageAsImage } from "unpdf";
import { defineWorkflow } from "openworkflow";

import { retrow, isError, unwrap, asPayload } from "~/utility/response";
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
      { name: "render-thumbnail-and-upsert" },
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
          const resultGetThumbnail = await thumbnails.getById(ThumbnailId);
          if (isError(resultGetThumbnail)) return retrow(resultGetThumbnail);
          const thumbnail = unwrap(resultGetThumbnail);

          // If the thumbnail has a low file, update it
          if (thumbnail.LowFileId) {
            const lowFileId = await updateLowFileAndReturnId(
              thumbnail.LowFileId,
              optimize,
            );
            if (isError(lowFileId)) return retrow(lowFileId);
            const Id = unwrap(lowFileId);

            // Update the placeholder and low file
            return await thumbnails.update({
              id: ThumbnailId,
              placeholder,
              lowFileId: Id,
            });
          }

          // Update the placeholder only
          return await thumbnails.update({
            id: ThumbnailId,
            placeholder,
            lowFileId: null,
          });
        } else {
          const dirname = path.posix.dirname(file.Path);
          const name = path.posix.basename(
            file.Path,
            path.posix.extname(file.Path),
          );
          const pathname = path.posix.join(
            "/Thumbnails/",
            dirname,
            name,
            "Low.webp",
          );

          const resultSaveThumbnailVault = await files.public.save({
            Path: pathname,
            Blob: optimize,
          });
          if (isError(resultSaveThumbnailVault))
            return retrow(resultSaveThumbnailVault);
          const thumbnailVaul = unwrap(resultSaveThumbnailVault);

          const resultSaveThumbnail = await thumbnails.save({
            placeholder,
            lowFileId: thumbnailVaul.Id,
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

const updateLowFileAndReturnId = async (lowFileId: string, blob: Blob) => {
  const resultLowFile = await files.public.getById(lowFileId);
  if (isError(resultLowFile)) return retrow(resultLowFile);
  const fileLow = unwrap(resultLowFile);

  const resultUpdate = await files.public.updateById({
    Id: fileLow.Id,
    Path: fileLow.Path,
    Blob: blob,
  });
  if (isError(resultUpdate)) return retrow(resultUpdate);
  const { Id } = unwrap(resultUpdate);
  return asPayload(200, Id);
};
