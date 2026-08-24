import { eq, desc } from "drizzle-orm";

import { getSQLClients } from "~/config/clients-sql";
import { DocumentsTable } from "~/db/schema";
import { defaultPagination, type PaginateType } from "~/schemas/general";
import type { InsertDocumentType } from "./types";
import { TypeStateDocumentKeys } from "~/db/enums";

const { sql } = getSQLClients();

const getAll = async (args?: PaginateType) => {
  const { Page, PageSize } = args ?? defaultPagination;
  const result = await sql
    .select()
    .from(DocumentsTable)
    .orderBy(desc(DocumentsTable.CreatedAt))
    .limit(PageSize)
    .offset((Page - 1) * PageSize);
  return result;
};

const getByIdMaybe = async (id: string) => {
  const result = await sql
    .select()
    .from(DocumentsTable)
    .where(eq(DocumentsTable.Id, id))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  const [row] = result;
  return row;
};

const create = async (document: InsertDocumentType) => {
  const result = await sql
    .insert(DocumentsTable)
    .values({
      Title: document.Title,
      Subject: document.Subject,
      Content: document.Content,
      TypeState: TypeStateDocumentKeys.Draft,
    })
    .returning();

  if (result.length === 0) {
    return null;
  }

  const [row] = result;
  return row;
};

export { getAll, getByIdMaybe, create };
