import type { DocumentsTable } from "~/db/schema";
import type { OmitInsertKeys, OmitUpdateKeys } from "~/utility/types";

type SelectDocumentType = typeof DocumentsTable.$inferSelect;
type InsertDocumentType = OmitInsertKeys<typeof DocumentsTable.$inferInsert>;
type UpdateDocumentType = OmitUpdateKeys<typeof DocumentsTable.$inferInsert>;

export type { SelectDocumentType, InsertDocumentType, UpdateDocumentType };
