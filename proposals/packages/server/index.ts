import mime from "mime-types";
import path from "node:path";

import { handle, asJson } from "./src/utility/response";
import { getClients } from "./src/config/clients";
import { SaveFileSchema } from "./src/schemas/validate";
import {
  existFile,
  existPath,
  getFileMaybe,
  insertFile,
  updateFile,
} from "./src/files";

const { vault } = getClients();

const server = Bun.serve({
  // `routes` requires Bun v1.2.3+
  routes: {
    // Static routes
    "/api/status": new Response("OK"),

    "/api/documents/:bucket/save": {
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
            vault.write(Path, await schema.Blob.arrayBuffer()),
            insertFile({
              Name,
              Path,
              Mimetype,
              Bucket: req.params.bucket,
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
    "/api/documents/:bucket/:id": {
      GET: async (req) => {
        const { id } = req.params;
        const file = await getFileMaybe(id);
        if (!file) {
          return asJson(404, { message: "Not found" });
        }
        const link = vault.presign(file.Path, {
          expiresIn: 3500,
          contentDisposition: `attachment; filename="${file.Name}"`,
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

          const Path = path.posix.normalize(schema.Path);
          const Name = path.posix.basename(Path);
          const Mimetype = schema.Blob.type ?? mime.lookup(Path);

          const [_, result] = await Promise.all([
            vault.write(Path, await schema.Blob.arrayBuffer()),
            updateFile(req.params.id, {
              Name,
              Path,
              Mimetype,
              Bucket: req.params.bucket,
            }),
          ]);
          const [row] = result;
          if (!row) {
            return asJson(500, { message: "Failed to update file" });
          }
          return asJson(200, { Id: row.Id });
        }),
      DELETE: () => new Response("Deleted"),
    },

    // Wildcard route for all routes that start with "/api/" and aren't otherwise matched
    "/api/*": Response.json({ message: "Not found" }, { status: 404 }),
  },
});

console.log(`Server running at ${server.url}`);
