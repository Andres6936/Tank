import mime from "mime-types";
import path from "node:path";

import { handle, asJson } from "./src/utility/response";
import { SaveFileSchema } from "./src/schemas/validate";
import {
  existPath,
  getFileMaybe,
  deleteFile,
  insertFile,
  updateFile,
} from "./src/files/sql";
import {
  getLinkFile,
  writeFile,
  updateFile as updateFileVault,
  deleteFile as deleteFileVault,
} from "./src/files/vault";

const server = Bun.serve({
  // `routes` requires Bun v1.2.3+
  routes: {
    // Static routes
    "/api/status": new Response("OK"),

    "/api/documents/save": {
      POST: async (req) =>
        await handle(async () => {
          const schema = SaveFileSchema.parse(
            Object.fromEntries(await req.formData()),
          );
          const Path = path.posix.normalize(schema.Path);
          const [exists, id] = await existPath(Path);
          if (exists) {
            return asJson(409, {
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
            return asJson(500, { message: "Failed to create file" });
          }
          return asJson(200, { Id: row.Id });
        }),
    },

    // Per-HTTP method handlers
    "/api/documents/:id": {
      GET: async (req) => {
        const { id } = req.params;
        const file = await getFileMaybe(id);
        if (!file) {
          return asJson(404, { message: "Not found" });
        }
        const link = await getLinkFile({
          Path: file.Path,
          Name: file.Name,
        });
        return asJson(200, { link });
      },
      PUT: async (req) =>
        await handle(async () => {
          const schema = SaveFileSchema.parse(
            Object.fromEntries(await req.formData()),
          );
          const file = await getFileMaybe(req.params.id);
          if (!file) {
            return asJson(404, { message: "Not found" });
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
            updateFile(req.params.id, {
              Name,
              Path,
              Mimetype,
            }),
          ]);
          const [row] = result;
          if (!row) {
            return asJson(500, { message: "Failed to update file" });
          }
          return asJson(200, { Id: row.Id });
        }),
      DELETE: async (req) => {
        const { id } = req.params;
        const file = await getFileMaybe(id);
        if (!file) {
          return asJson(404, { message: "Not found" });
        }

        const [_, result] = await Promise.all([
          deleteFileVault({ Path: file.Path }),
          deleteFile(id),
        ]);
        if (!result) {
          return asJson(500, { message: "Failed to delete file" });
        }
        return asJson(200, { Id: result.Id });
      },
    },

    // Wildcard route for all routes that start with "/api/" and aren't otherwise matched
    "/api/*": Response.json({ message: "Not found" }, { status: 404 }),
  },
});

console.log(`Server running at ${server.url}`);
