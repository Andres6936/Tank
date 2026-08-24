import { eq, desc } from "drizzle-orm";

import { getSQLClients } from "~/config/clients-sql";
import { DocumentsTable } from "~/db/schema";
import { defaultPagination, type PaginateType } from "~/schemas/general";
import { TypeStateDocumentKeys } from "~/db/enums";

import { Args, type InferArgs } from "./args";
import type { OmitUpdateKeys } from "~/utility/types";

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

const create = async (document: InferArgs["create"]) => {
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

const updateContent = async (
  id: string,
  document: OmitUpdateKeys<InferArgs["updateContent"]>,
) => {
  const result = await sql
    .update(DocumentsTable)
    .set({
      Title: document.Title,
      Subject: document.Subject,
      Content: document.Content,
    })
    .where(eq(DocumentsTable.Id, id))
    .returning();

  if (result.length === 0) {
    return null;
  }

  const [row] = result;
  return row;
};

export { getAll, getByIdMaybe, create, updateContent };
