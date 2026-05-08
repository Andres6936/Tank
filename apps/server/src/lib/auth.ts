import { betterAuth } from "better-auth";
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

export const auth = betterAuth({
  experimental: { joins: true },
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
  plugins: [apiKey()],
});
