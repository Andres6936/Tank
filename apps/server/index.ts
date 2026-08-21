import { auth } from "./src/lib/auth";
import { handler } from "./src/server";

const server = Bun.serve({
  port: 3000,
  routes: {
    "/api/status": new Response("OK"),
    "/api/auth/*": (r) => auth.handler(r),
    "/trpc/*": async (request) => {
      const response = await handler(request);
      const overwrite = new Response(response.body, response);
      const cors = {
        "Access-Control-Allow-Origin": request.headers.get("Origin") || "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      };
      for (const [key, value] of Object.entries(cors)) {
        overwrite.headers.set(key, value);
      }
      return overwrite;
    },
  },
});

console.log(`Server running at ${server.url}`);

process.on("SIGABRT", () => {
  server.stop();
});
