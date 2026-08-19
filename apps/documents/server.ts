import { z } from "zod";
import ReactPDF from "@react-pdf/renderer";

import { getBufferSeals, getBreBCode, document, invoice } from "entry";

const SealSchema = z.literal(['red', 'blue', 'green']);

const DocumentsSchema = z.object({
  xml: z.string(),
  seal: SealSchema,
});

const InvoicesSchema = z.object({
  xml: z.string(),
  seal: SealSchema,
});


const server = Bun.serve({
  port: process.env.SERVER_PORT,
  routes: {
    "/api/status": new Response("OK"),
    "/api/documents": {
      POST: async (req) => {
        const payload = await req.json();
        const result = DocumentsSchema.safeParse(payload);
        if (!result.success) {
          return new Response(JSON.stringify(result.error), { status: 403 });
        }
        const schema = result.data;
        const buffers = await getBufferSeals({
          seal: schema.seal,
        });
        const doc = await document.run({ xml: schema.xml, buffers });
        const buffer = await ReactPDF.renderToStream(doc) as any as ReadableStream<Uint8Array>;
        return new Response(buffer, { headers: { "Content-Type": "application/pdf" } });
      }
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
        const buffer = await ReactPDF.renderToStream(doc) as any as ReadableStream<Uint8Array>;
        return new Response(buffer, { headers: { "Content-Type": "application/pdf" } });
      }
    }
  }
})

console.log(`Server running at ${server.url}`);
