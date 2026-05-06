import { SaveFileSchema } from "./src/schemas/validate";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { FilesTable } from "./src/db/schema";
import { z } from "zod";

const client = createClient({
  url: process.env.LIBSQL_URL!,
  authToken: process.env.LIBSQL_AUTH_TOKEN!,
});
const db = drizzle({ client });

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
          const result = await db
            .insert(FilesTable)
            .values({
              Name: schema.Name,
              Path: schema.Path,
              Bucket: schema.Bucket,
              Mimetype: schema.Mimetype,
            })
            .returning({ Id: FilesTable.Id });
          const [row] = result;
          if (!row) {
            return Response.json(
              {
                statusCode: 500,
                body: { message: "Failed to create file" },
              },
              { status: 500 },
            );
          }
          return Response.json(
            { statusCode: 200, body: { Id: row.Id } },
            { status: 200 },
          );
        } catch (error) {
          if (error instanceof z.ZodError) {
            return Response.json(
              {
                statusCode: 403,
                body: { message: "Validation Error", issues: error.issues },
              },
              { status: 403 },
            );
          }

          return Response.json(
            {
              statusCode: 501,
              body: { message: "Server Error", error },
            },
            { status: 501 },
          );
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
