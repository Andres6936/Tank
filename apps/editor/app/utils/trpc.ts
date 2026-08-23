import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@escriba/server";

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>();

export type { AppRouter };
