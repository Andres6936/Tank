import mime from "mime-types";
import path from "node:path";
import { z } from "zod";

import { asPayload } from "~/utility/response";
import { SaveFileSchema, UpdateFileSchema } from "~/schemas/validate";
import { PaginateSchema } from "~/schemas/general";

import {
  existPath,
  getAll,
  getFileMaybe,
  deleteFile,
  insertFile,
  updateFile,
} from "./sql";
import {
  getLinkFile,
  writeFile,
  updateFile as updateFileVault,
  deleteFile as deleteFileVault,
} from "./vault";

export const Args = {
  getAll: z.optional(PaginateSchema),
  save: z.instanceof(FormData),
  getById: z.uuidv7(),
  updateById: z.instanceof(FormData),
  deleteById: z.uuidv7(),
};

export default {
  getAll: async (args: z.infer<typeof Args.getAll>) => {
    const result = await getAll(args);
    return asPayload(200, result);
  },
  save: async (args: z.infer<typeof Args.save>) => {
    const schema = SaveFileSchema.parse(Object.fromEntries(args.entries()));
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
  },
  getById: async (args: z.infer<typeof Args.getById>) => {
    const file = await getFileMaybe(args);
    if (!file) {
      return asPayload(404, { message: "Not found" });
    }
    const link = await getLinkFile({
      Path: file.Path,
      Name: file.Name,
    });
    return asPayload(200, { link });
  },
  updateById: async (args: z.infer<typeof Args.updateById>) => {
    const schema = UpdateFileSchema.parse(Object.fromEntries(args.entries()));
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
  },
  deleteById: async (args: z.infer<typeof Args.deleteById>) => {
    const file = await getFileMaybe(args);
    if (!file) {
      return asPayload(404, { message: "Not found" });
    }

    const [_, result] = await Promise.all([
      deleteFileVault({ Path: file.Path }),
      deleteFile(args),
    ]);
    if (!result) {
      return asPayload(500, { message: "Failed to delete file" });
    }
    return asPayload(200, { Id: result.Id });
  },
};
