import { z } from "zod";
import ReactPDF from "@react-pdf/renderer";

import { getBufferSeals, getBreBCode, document, invoice } from "entry";

const DocumentsSchema = z.object({
  xml: z.string(),
  seal: z.literal(['red', 'blue', 'green']),
});

const server = Bun.serve({
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
    "/api/invoices": async () => {
      const buffers = await getBufferSeals({
        seal: 'red',
      });
      const xml = await Bun.file('./input/invoices/151/reference.xml').text();
      const breBCode = getBreBCode();
      const doc = await invoice.run({ xml, breBCode, buffers });
      const buffer = await ReactPDF.renderToStream(doc) as any as ReadableStream<Uint8Array>;
      return new Response(buffer, { headers: { "Content-Type": "application/pdf" } });
    }
  }
})

console.log(`Server running at ${server.url}`);
