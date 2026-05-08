import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { defaultId, defaultISODate } from "./default";

const defaultColumns = {
  Metadata: text().notNull().default("{}"),
  CreatedAt: defaultISODate,
};

export const FilesTable = sqliteTable("Files", {
  Id: defaultId,
  Name: text().notNull(),
  Bucket: text().notNull(),
  Mimetype: text().notNull(),
  Path: text().notNull().unique(),
  ...defaultColumns,
});

export type FilesTableInsert = typeof FilesTable.$inferInsert;

export type FilesTableSelect = typeof FilesTable.$inferSelect;
