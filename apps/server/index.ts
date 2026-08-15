import { auth } from "./src/lib/auth";

const server = Bun.serve({
  // `routes` requires Bun v1.2.3+
  routes: {
    // Static routes
    "/api/status": new Response("OK"),
    "/api/auth/*": (r) => auth.handler(r),
    // Wildcard route for all routes that start with "/api/" and aren't otherwise matched
    "/api/*": Response.json({ message: "Not found" }, { status: 404 }),
  },
});

console.log(`Server running at ${server.url}`);
