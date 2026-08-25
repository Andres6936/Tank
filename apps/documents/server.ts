import { z } from "zod";
import ReactPDF from "@react-pdf/renderer";

import { getBufferSeals, getBreBCode, document, invoice } from "entry";

const SealSchema = z.literal(["red", "blue", "green"]);

const DocumentsSchema = z.object({
  xml: z.string(),
  seal: SealSchema,
});

const InvoicesSchema = z.object({
  xml: z.string(),
  seal: SealSchema,
});

const asPayload = <const T extends number, Q>(status: T, payload: Q) => ({
  statusCode: status,
  body: payload,
});

const hasErrorMessage = (error: unknown): error is { message: string } => {
  return typeof error === "object" && error !== null && "message" in error;
};

const handle =
  <Args extends unknown[]>(
    fn: (...args: Args) => Promise<Response>,
  ): ((...args: Args) => Promise<Response>) =>
  async (...args: Args) => {
    try {
      return await fn(...args);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const payload = asPayload(403, {
          message: "Validation Error",
          issues: error.issues,
        });
        return new Response(JSON.stringify(payload.body), {
          status: payload.statusCode,
        });
      }
      const payload = asPayload(501, {
        message: "Server Error",
        error: hasErrorMessage(error) ? error.message : "None message",
      });
      console.error(payload);
      return new Response(JSON.stringify(payload.body), {
        status: payload.statusCode,
      });
    }
  };

const server = Bun.serve({
  port: process.env.SERVER_PORT,
  routes: {
    "/api/status": new Response("OK"),
    "/api/documents": {
      POST: async (req) =>
        await handle(async () => {
          const schema = DocumentsSchema.parse(await req.json());
          const buffers = await getBufferSeals({
            seal: schema.seal,
          });
          const doc = await document.run({ xml: schema.xml, buffers });
          const buffer = (await ReactPDF.renderToStream(
            doc,
          )) as any as ReadableStream<Uint8Array>;
          const cors = {
            "Access-Control-Allow-Origin": req.headers.get("Origin") || "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          };
          return new Response(buffer, {
            headers: { "Content-Type": "application/pdf", ...cors },
          });
        })(),
    },
    "/api/invoices": {
      POST: async (req) => {
        const payload = await req.json();
        const result = InvoicesSchema.safeParse(payload);
        if (!result.success) {
          return new Response(JSON.stringify(result.error), { status: 403 });
        }
        const schema = result.data;
        const buffers = await getBufferSeals({
          seal: schema.seal,
        });
        const breBCode = getBreBCode();
        const doc = await invoice.run({ xml: schema.xml, breBCode, buffers });
        const buffer = (await ReactPDF.renderToStream(
          doc,
        )) as any as ReadableStream<Uint8Array>;
        return new Response(buffer, {
          headers: { "Content-Type": "application/pdf" },
        });
      },
    },
  },
});

console.log(`Server running at ${server.url}`);
