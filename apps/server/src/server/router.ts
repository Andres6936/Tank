import mime from "mime-types";
import path from "node:path";
import { z } from "zod";

import { auth } from "~/lib/auth";
import { publicProcedure, router } from "./trpc";
import { handle, asPayload } from "~/utility/response";
import { SaveFileSchema, UpdateFileSchema } from "~/schemas/validate";
import {
  existPath,
  getAll,
  getFileMaybe,
  deleteFile,
  insertFile,
  updateFile,
} from "~/files/sql";
import {
  getLinkFile,
  writeFile,
  updateFile as updateFileVault,
  deleteFile as deleteFileVault,
} from "~/files/vault";
import { PaginateSchema } from "~/schemas/general";

export const app = router({
  status: publicProcedure.query(async () => {
    return asPayload(200, { message: "OK" });
  }),
  documents: {
    getAll: publicProcedure.input(z.optional(PaginateSchema)).query(handle(async (args) => {
      const { input } = args;
      const result = await getAll(input);
      return asPayload(200, result);
    })),
    save: publicProcedure.input(z.instanceof(FormData)).mutation(
      handle(async (args) => {
          const { input } = args;
          const schema = SaveFileSchema.parse(
            Object.fromEntries(input.entries()),
          );
          const Path = path.posix.normalize(schema.Path);
          const [exists, id] = await existPath(Path);
          if (exists) {
            return asPayload(409, {
              message: `File already exists with Id: ${id}`,
            });
          }

          const Name = path.posix.basename(Path);
          const Mimetype = schema.Blob.type ?? mime.lookup(Path);

          const [_, result] = await Promise.all([
            writeFile({ Path, Blob: schema.Blob }),
            insertFile({
              Name,
              Path,
              Mimetype,
            }),
          ]);
          const [row] = result;
          if (!row) {
            return asPayload(500, { message: "Failed to create file" });
          }
          return asPayload(200, { Id: row.Id });
        }),
    ),
    getById: publicProcedure.input(z.uuidv7()).query(async (args) => {
      const { input: id } = args;
      const file = await getFileMaybe(id);
      if (!file) {
        return asPayload(404, { message: "Not found" });
      }
      const link = await getLinkFile({
        Path: file.Path,
        Name: file.Name,
      });
      return asPayload(200, { link });
    }),
    updateById: publicProcedure.input(z.instanceof(FormData)).mutation(
         handle(async (args) => {
          const { input } = args;
          const schema = UpdateFileSchema.parse(
            Object.fromEntries(input.entries()),
          );
          const file = await getFileMaybe(schema.Id);
          if (!file) {
            return asPayload(404, { message: "Not found" });
          }

          const OldPath = file.Path;
          const Path = path.posix.normalize(schema.Path);
          const Name = path.posix.basename(Path);
          const Mimetype = schema.Blob.type ?? mime.lookup(Path);

          const [_, result] = await Promise.all([
            updateFileVault({
              OldPath,
              NewPath: Path,
              Blob: schema.Blob,
            }),
            updateFile(schema.Id, {
              Name,
              Path,
              Mimetype,
            }),
          ]);
          const [row] = result;
          if (!row) {
            return asPayload(500, { message: "Failed to update file" });
          }
          return asPayload(200, { Id: row.Id });
        }),
    ),
    deleteById: publicProcedure.input(z.uuidv7()).mutation(async (args) => {
      const { input: id } = args;
      const file = await getFileMaybe(id);
      if (!file) {
        return asPayload(404, { message: "Not found" });
      }

      const [_, result] = await Promise.all([
        deleteFileVault({ Path: file.Path }),
        deleteFile(id),
      ]);
      if (!result) {
        return asPayload(500, { message: "Failed to delete file" });
      }
      return asPayload(200, { Id: result.Id });
    }),
  },
});

export type AppRouter = typeof app;
