import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { defaultId } from "./default";

export const Users = sqliteTable("Users", {
  id: defaultId,
  name: text("Name").notNull(),
  email: text("Email").notNull().unique(),
  emailVerified: integer("EmailVerified", { mode: "boolean" })
    .default(false)
    .notNull(),
  image: text("Image"),
  createdAt: integer("CreatedAt", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("UpdatedAt", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const Sessions = sqliteTable(
  "Sessions",
  {
    id: defaultId,
    expiresAt: integer("ExpiresAt", { mode: "timestamp_ms" }).notNull(),
    token: text("Token").notNull().unique(),
    createdAt: integer("CreatedAt", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("UpdatedAt", { mode: "timestamp_ms" })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("IpAddress"),
    userAgent: text("UserAgent"),
    userId: text("UserId")
      .notNull()
      .references(() => Users.id, { onDelete: "cascade" }),
  },
  (table) => [index("Sessions_userId_idx").on(table.userId)],
);

export const Accounts = sqliteTable(
  "Accounts",
  {
    id: defaultId,
    accountId: text("AccountId").notNull(),
    providerId: text("ProviderId").notNull(),
    userId: text("UserId")
      .notNull()
      .references(() => Users.id, { onDelete: "cascade" }),
    accessToken: text("AccessToken"),
    refreshToken: text("RefreshToken"),
    idToken: text("IdToken"),
    accessTokenExpiresAt: integer("AccessTokenExpiresAt", {
      mode: "timestamp_ms",
    }),
    refreshTokenExpiresAt: integer("RefreshTokenExpiresAt", {
      mode: "timestamp_ms",
    }),
    scope: text("Scope"),
    password: text("Password"),
    createdAt: integer("CreatedAt", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("UpdatedAt", { mode: "timestamp_ms" })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("Accounts_userId_idx").on(table.userId)],
);

export const Verifications = sqliteTable(
  "Verifications",
  {
    id: defaultId,
    identifier: text("Identifier").notNull(),
    value: text("Value").notNull(),
    expiresAt: integer("ExpiresAt", { mode: "timestamp_ms" }).notNull(),
    createdAt: integer("CreatedAt", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("UpdatedAt", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("Verifications_identifier_idx").on(table.identifier)],
);

export const ApiKeys = sqliteTable(
  "ApiKeys",
  {
    id: defaultId,
    configId: text("ConfigId").default("default").notNull(),
    name: text("Name"),
    start: text("Start"),
    referenceId: text("ReferenceId").notNull(),
    prefix: text("Prefix"),
    key: text("Key").notNull(),
    refillInterval: integer("RefillInterval"),
    refillAmount: integer("RefillAmount"),
    lastRefillAt: integer("LastRefillAt", { mode: "timestamp_ms" }),
    enabled: integer("Enabled", { mode: "boolean" }).default(true),
    rateLimitEnabled: integer("RateLimitEnabled", {
      mode: "boolean",
    }).default(true),
    rateLimitTimeWindow: integer("RateLimitTimeWindow").default(86400000),
    rateLimitMax: integer("RateLimitMax").default(10),
    requestCount: integer("RequestCount").default(0),
    remaining: integer("Remaining"),
    lastRequest: integer("LastRequest", { mode: "timestamp_ms" }),
    expiresAt: integer("ExpiresAt", { mode: "timestamp_ms" }),
    createdAt: integer("CreatedAt", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("UpdatedAt", { mode: "timestamp_ms" }).notNull(),
    permissions: text("Permissions"),
    metadata: text("Metadata"),
  },
  (table) => [
    index("apikeys_configId_idx").on(table.configId),
    index("apikeys_referenceId_idx").on(table.referenceId),
    index("apikeys_key_idx").on(table.key),
  ],
);

export const UsersRelations = relations(Users, ({ many }) => ({
  sessions: many(Sessions),
  accounts: many(Accounts),
}));

export const SessionsRelations = relations(Sessions, ({ one }) => ({
  Users: one(Users, {
    fields: [Sessions.userId],
    references: [Users.id],
  }),
}));

export const AccountsRelations = relations(Accounts, ({ one }) => ({
  Users: one(Users, {
    fields: [Accounts.userId],
    references: [Users.id],
  }),
}));
