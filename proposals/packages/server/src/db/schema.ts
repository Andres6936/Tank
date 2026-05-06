import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

const defaultId = text()
  .primaryKey()
  .default(sql`(uuid7())`);

const defaultColumns = {
  Metadata: text().notNull().default("{}"),
  CreatedAt: text()
    .notNull()
    .default(sql`(time_fmt_iso(time_now()))`),
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
