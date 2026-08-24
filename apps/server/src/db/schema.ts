import { sql } from "drizzle-orm";
import { sqliteTable, text, index } from "drizzle-orm/sqlite-core";
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

export const TypeStateDocument = sqliteTable("TypeStateDocument", {
  Type: text().primaryKey().notNull(),
  Metadata: text().notNull().default("{}"),
});

export const DocumentsTable = sqliteTable(
  "Documents",
  {
    Id: defaultId,
    Title: text().notNull(),
    Subject: text().notNull(),
    Content: text().notNull(),
    TypeState: text()
      .notNull()
      .references(() => TypeStateDocument.Type),
    FileId: text().references(() => FilesTable.Id, { onDelete: "cascade" }),
    ...defaultColumns,
  },
  (table) => [index("Document_FileId").on(table.FileId)],
);

export type FilesTableInsert = typeof FilesTable.$inferInsert;

export type FilesTableSelect = typeof FilesTable.$inferSelect;
