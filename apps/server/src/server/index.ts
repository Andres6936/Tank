import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { app } from "./router";

const server = createHTTPServer({
  router: app,
});

server.listen(3000);
