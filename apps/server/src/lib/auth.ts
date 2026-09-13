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
  baseURL: `http://localhost:${process.env.SERVER_PORT}`,
  trustedOrigins: [
    process.env.NODE_ENV === "development" ? "http://localhost:5173" : "", // Vite dev server,
    "https://editor.andres6936.dev",
  ],
  advanced: {
    database: {
      joins: true,
    },
  },
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
