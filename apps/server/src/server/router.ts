import { asPayload } from "~/utility/response";
import { publicProcedure, router } from "./trpc";

import files from "~/files/router";

export const app = router({
  status: publicProcedure.query(async () => {
    return asPayload(200, { message: "OK" });
  }),
  files,
});

export type AppRouter = typeof app;
