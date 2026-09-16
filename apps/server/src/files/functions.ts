import mime from "mime-types";
import path from "node:path";

import { asPayload } from "~/utility/response";

import {
  deleteFile,
  existPath,
  getAll,
  getFileMaybe,
  insertFile,
  updateFile,
} from "./sql";
import { writeFile, privateBucketFn } from "./vault";

import { TypeBucketKeys } from "~/db/enums";
import { type InferArgs } from "./args";

export default {
  getAll: async (args: InferArgs["getAll"]) => {
    const result = await getAll(args);
    return asPayload(200, result);
  },
  save: async (args: InferArgs["save"]) => {
    const Path = path.posix.normalize(args.Path);
    const [exists, id] = await existPath(Path);
    if (exists) {
      return asPayload(409, {
        message: `File already exists with Id: ${id} and Path: ${Path}`,
      });
    }

    const Name = path.posix.basename(Path);
    const Mimetype =
      args.Blob instanceof Blob
        ? args.Blob.type
        : (mime.lookup(Path) as string);

    const { sha256 } = await writeFile({
      Path,
      Blob: args.Blob,
      TypeBucket: TypeBucketKeys.Private,
    });
    const result = await insertFile({
      Name,
      Path,
      Mimetype,
      SHA256: sha256,
    });
    const [row] = result;
    if (!row) {
      return asPayload(500, { message: "Failed to create file" });
    }
    return asPayload(200, { Id: row.Id, SHA256: sha256 });
  },
  getById: async (args: InferArgs["getById"]) => {
    const file = await getFileMaybe(args);
    if (!file) {
      return asPayload(404, { message: "Not found" });
    }
    return asPayload(200, file);
  },
  getLinkById: async (args: InferArgs["getLinkById"]) => {
    const file = await getFileMaybe(args.Id);
    if (!file) {
      return asPayload(404, { message: "Not found" });
    }
    const link = await privateBucketFn.getLinkFile({
      Path: file.Path,
      Name: file.Name,
      Download: args.Download,
    });
    return asPayload(200, { link });
  },
  updateById: async (args: InferArgs["updateById"]) => {
    const file = await getFileMaybe(args.Id);
    if (!file) {
      return asPayload(404, { message: "Not found" });
    }

    const OldPath = file.Path;
    const Path = path.posix.normalize(args.Path);
    const Name = path.posix.basename(Path);
    const Mimetype =
      args.Blob instanceof Blob
        ? args.Blob.type
        : (mime.lookup(Path) as string);

    const { sha256 } = await privateBucketFn.updateFile({
      OldPath,
      NewPath: Path,
      Blob: args.Blob,
    });
    const result = await updateFile(args.Id, {
      Name,
      Path,
      Mimetype,
      SHA256: sha256,
    });
    const [row] = result;
    if (!row) {
      return asPayload(500, { message: "Failed to update file" });
    }
    return asPayload(200, { Id: row.Id });
  },
  deleteById: async (args: InferArgs["deleteById"]) => {
    const file = await getFileMaybe(args);
    if (!file) {
      return asPayload(404, { message: "Not found" });
    }

    const [_, result] = await Promise.all([
      privateBucketFn.deleteFile({ Path: file.Path }),
      deleteFile(args),
    ]);
    if (!result) {
      return asPayload(500, { message: "Failed to delete file" });
    }
    return asPayload(200, { Id: result.Id });
  },
};
