import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { apiKey } from "@better-auth/api-key";

import { getSQLClients } from "../config/clients-sql";
import {
  Accounts,
  ApiKeys,
  Sessions,
  Users,
  Verifications,
} from "../db/auth-schema";

const { sql } = getSQLClients();

// I needed this for avoid the error [tsc] src/lib/auth.ts - error TS7056: The inferred
// type of this node exceeds the maximum length the compiler will serialize.
//  An explicit type annotation is needed.
type Plugins = [ReturnType<typeof apiKey>];

const plugins: Plugins = [apiKey()];

const config = {
  baseURL: `http://localhost:${process.env.SERVER_PORT}`,
  trustedOrigins: [
    process.env.NODE_ENV === "development" ? "http://localhost:5173" : "", // Vite dev server,
    "https://editor.andres6936.dev",
  ],
  emailAndPassword: { enabled: true },
  database: drizzleAdapter(sql, {
    provider: "sqlite",
    usePlural: true,
    schema: {
      users: Users,
      sessions: Sessions,
      accounts: Accounts,
      verifications: Verifications,
      apikeys: ApiKeys,
    },
  }),
  plugins,
} satisfies BetterAuthOptions;

export const auth = betterAuth(config) as ReturnType<
  typeof betterAuth<typeof config>
>;
