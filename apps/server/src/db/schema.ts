import { sqliteTable, text, index } from "drizzle-orm/sqlite-core";
import { defaultId, withISODate } from "./default";

const defaultColumns = {
  UpdatedAt: withISODate("UpdatedAt"),
  CreatedAt: withISODate("CreatedAt"),
};

export type FileTableMetadata = {
  SHA256: string;
};

export const FilesTable = sqliteTable("Files", {
  Id: defaultId,
  Name: text().notNull(),
  Bucket: text().notNull(),
  Mimetype: text().notNull(),
  Path: text().notNull().unique(),
  Metadata: text({ mode: "json" }).notNull().$type<FileTableMetadata>(),
  ...defaultColumns,
});

export const TypeStateDocument = sqliteTable("TypeStateDocument", {
  Type: text().primaryKey().notNull(),
  Metadata: text().notNull().default("{}"),
});

export type DocumentsTableMetadata = {};

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
    Metadata: text({ mode: "json" }).notNull().$type<DocumentsTableMetadata>(),
    ...defaultColumns,
  },
  (table) => [index("Document_FileId").on(table.FileId)],
);
