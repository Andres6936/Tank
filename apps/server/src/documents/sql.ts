import { eq, desc, lt } from "drizzle-orm";

import { formatXML } from "~/utility/formatter";
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

const getAllInfinite = async (args: InferArgs["getAllInfinite"]) => {
  const result = await sql
    .select()
    .from(DocumentsTable)
    // If the cursor is provided, get documents after it
    .where(args.cursor ? lt(DocumentsTable.Id, args.cursor) : undefined)
    .orderBy(desc(DocumentsTable.Id))
    .limit(args.limit);
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
  const content = Bun.XML.stringify(
    {
      Document: {
        "@subjet": document.Subject,
        "@title": document.Title,
        "@author": document.Author,
        "@keywords": document.Keywords,
        "@creator": document.Creator,
        "@producer": document.Producer,
        "@language": document.Language,
        Cover: {
          "@type":
            document.Type.length === 0 ? document.Subject : document.Type,
          "@title":
            document.Cover.length === 0 ? document.Title : document.Cover,
          "@month": document.Month,
        },
        Paginate: {
          IndicatorHeader: {
            "@value": "Header Line",
          },
          Section: {
            "@marginTop": "0",
            "@gap": "0.1cm",
            Title: {
              "#text": "Title",
            },
            Paragraph: {
              "#text": "Paragraph",
            },
          },
        },
      },
    },
    null,
    2,
  );

  const result = await sql
    .insert(DocumentsTable)
    .values({
      Title: document.Title,
      Subject: document.Subject,
      Content: await formatXML(content),
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
      Content: await formatXML(document.Content),
    })
    .where(eq(DocumentsTable.Id, id))
    .returning({ Content: DocumentsTable.Content });

  if (result.length === 0) {
    return null;
  }

  const [row] = result;
  return row;
};

const updateFileLinkAndSeal = async (id: string, fileId: string) => {
  const result = await sql
    .update(DocumentsTable)
    .set({
      FileId: fileId,
      TypeState: TypeStateDocumentKeys.Sealed,
    })
    .where(eq(DocumentsTable.Id, id))
    .returning();

  if (result.length === 0) {
    return null;
  }

  const [row] = result;
  return row;
};

export {
  getAll,
  getAllInfinite,
  getByIdMaybe,
  create,
  updateContent,
  updateFileLinkAndSeal,
};
