import { SaveFileSchema } from "./src/schemas/validate";
import { FilesTable, type FilesTableInsert } from "./src/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { asJson } from "./src/utility/response";
import { getClients } from "./src/config/clients";

const { vault, sql } = getClients();

const alreadyExistPath = async (
  path: string,
): Promise<[true, string] | [false, null]> => {
  const result = await sql
    .select({ Id: FilesTable.Id })
    .from(FilesTable)
    .where(eq(FilesTable.Path, path))
    .limit(1);

  if (result.length > 0) {
    return [true, result[0]!.Id];
  }
  return [false, null];
};

const hasErrorMessage = (error: unknown): error is { message: string } => {
  return typeof error === "object" && error !== null && "message" in error;
};

const insertFile = async (schema: FilesTableInsert) => {
  return await sql
    .insert(FilesTable)
    .values({
      Name: schema.Name,
      Path: schema.Path,
      Bucket: schema.Bucket,
      Mimetype: schema.Mimetype,
    })
    .returning({ Id: FilesTable.Id });
};

const server = Bun.serve({
  // `routes` requires Bun v1.2.3+
  routes: {
    // Static routes
    "/api/status": new Response("OK"),

    "/api/documents/save": {
      POST: async (req) => {
        try {
          const schema = SaveFileSchema.parse(
            Object.fromEntries(await req.formData()),
          );
          const [exists, id] = await alreadyExistPath(schema.Path);
          if (exists) {
            return asJson(409, {
              message: `File already exists with Id: ${id}`,
            });
          }

          const [_, result] = await Promise.all([
            vault.write(schema.Path, await schema.Blob.arrayBuffer()),
            insertFile(schema),
          ]);
          const [row] = result;
          if (!row) {
            return asJson(500, { message: "Failed to create file" });
          }
          return asJson(200, { Id: row.Id });
        } catch (error) {
          if (error instanceof z.ZodError) {
            return asJson(403, {
              message: "Validation Error",
              issues: error.issues,
            });
          }
          return asJson(501, {
            message: "Server Error",
            error: hasErrorMessage(error) ? error.message : "None message",
          });
        }
      },
    },

    // Per-HTTP method handlers
    "/api/documents/:id": {
      GET: (req) => new Response(`List posts for ${req.params.id}`),
      PUT: async (req) => {
        const body = await req.json();
        return Response.json({ updated: true, ...body });
      },
      DELETE: () => new Response("Deleted"),
    },

    // Wildcard route for all routes that start with "/api/" and aren't otherwise matched
    "/api/*": Response.json({ message: "Not found" }, { status: 404 }),
  },
});

console.log(`Server running at ${server.url}`);
