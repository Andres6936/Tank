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

const GetAllSchema = z.optional(PaginateSchema)

const SaveSchema = z.instanceof(FormData);

export default {
  getAll: async (args: z.infer<typeof GetAllSchema>) => {
    const result = await getAll(args);
    return asPayload(200, result);
  },
  save: async (args: z.infer<typeof SaveSchema>) => {
    const schema = SaveFileSchema.parse(
      Object.fromEntries(args.entries()),
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
  },
}
