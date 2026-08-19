import { asPayload } from "~/utility/response";
import { publicProcedure, router } from "./trpc";

import files from "~/files/router";
import documents from "~/documents/router";

export const app = router({
  status: publicProcedure.query(async () => {
    return asPayload(200, { message: "OK" });
  }),
  files,
  documents,
});

export type AppRouter = typeof app;
