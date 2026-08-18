import ReactPDF from "@react-pdf/renderer";
import { getBufferSeals, getBreBCode, document, invoice } from "entry";

const server = Bun.serve({
  routes: {
    "/api/status": new Response("OK"),
    "/api/documents": async () => {
      const buffers = await getBufferSeals({
        seal: 'red',
      });
      const xml = await Bun.file('./input/acts/2026-06-26.xml').text();
      const doc = await document.run({ xml, buffers });
      const buffer = await ReactPDF.renderToStream(doc) as any as ReadableStream<Uint8Array>;
      return new Response(buffer, { headers: { "Content-Type": "application/pdf" } });
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
