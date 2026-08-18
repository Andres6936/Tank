import { auth } from "./src/lib/auth";
import { handler } from "./src/server";

const server = Bun.serve({
  port: 3000,
  // `routes` requires Bun v1.2.3+
  routes: {
    // Static routes
    "/api/status": new Response("OK"),
    "/api/auth/*": (r) => auth.handler(r),
    "/trpc/*": (r) => handler(r),
  },
});

console.log(`Server running at ${server.url}`);

process.on('SIGABRT', () => {
  server.stop();
});
