import { fetchRequestHandler, } from "@trpc/server/adapters/fetch";
import { app } from "./router";

export const handler = (req: Request) => fetchRequestHandler({
  req,
  router: app,
  endpoint: "/trpc",
});
