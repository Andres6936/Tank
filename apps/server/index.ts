import { auth } from "./src/lib/auth";
import { handler } from "./src/server";

const getCors = (origin: string) => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-TRPC-Source",
  "Access-Control-Allow-Credentials": "true",
});

const server = Bun.serve({
  port: process.env.SERVER_PORT,
  routes: {
    "/api/status": new Response("OK"),
    "/api/auth/*": async (request) => {
      const cors = getCors(request.headers.get("Origin") || "*");
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: cors,
        });
      }
      const response = await auth.handler(request);
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
    "/trpc/*": async (request) => {
      const cors = getCors(request.headers.get("Origin") || "*");
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
