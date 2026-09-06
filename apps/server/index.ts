import { auth } from "./src/lib/auth";
import { handler } from "./src/server";

const server = Bun.serve({
  port: process.env.SERVER_PORT,
  routes: {
    "/api/status": new Response("OK"),
    "/api/auth/*": (r) => auth.handler(r),
    "/trpc/*": async (request) => {
      const cors = {
        "Access-Control-Allow-Origin": request.headers.get("Origin") || "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-TRPC-Source",
      };
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: cors,
        });
      }
      const response = await handler(request);
      const headers = new Headers(response.headers);
      for (const [key, value] of Object.entries(cors)) {
        headers.set(key, value);
      }
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    },
  },
});

console.log(`Server running at ${server.url}`);
