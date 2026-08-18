import {
  createTRPCClient,
  splitLink,
  isNonJsonSerializable,
  httpLink,
  httpBatchLink,
} from "@trpc/client";
import type { AppRouter } from "~/server/router";

//     👆 **type-only** imports are stripped at build time
// Pass AppRouter as a type parameter. 👇 This lets `trpc` know
// what procedures are available on the server and their input/output types.
const trpc = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition: (args) => isNonJsonSerializable(args.input),
      true: httpLink({
        url: "http://localhost:3000/trpc",
      }),
      false: httpBatchLink({
        url: "http://localhost:3000/trpc",
      }),
    }),
  ],
});

export { trpc };
