import { asPayload, isError, retrow } from "~/utility/response";
import { TypeStateDocumentKeys } from "~/db/enums";

import files from "~/files/functions";
import { type InferArgs } from "./args";
import * as sql from "./sql";
import { getDocumentHeader, getDocumentProps } from "./utility";

export default {
  getAll: async (args: InferArgs["getAll"]) => {
    const result = await sql.getAll(args);
    return asPayload(200, result);
  },
  getAllInfinite: async (args: InferArgs["getAllInfinite"]) => {
    const result = await sql.getAllInfinite(args);
    const hasMore = result.length === args.limit;
    return asPayload(200, {
      items: result,
      nextCursor: hasMore ? result.at(-1)!.Id : undefined,
    });
  },
  seal: async (args: InferArgs["seal"]) => {
    const document = await sql.getByIdMaybe(args);
    if (!document) return asPayload(404, { message: "Not found" });
    if (document.TypeState !== TypeStateDocumentKeys.Draft) {
      return asPayload(401, { message: "Document is not in draft state" });
    }
    const stream = await fetch(
      new URL("/api/documents", process.env.PREVIEW_URL).href,
      {
        method: "POST",
        body: JSON.stringify({
          xml: document.Content,
          seal: "red",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!stream.ok) return asPayload(500, { message: "Failed to generate" });
    const payload = await stream.arrayBuffer();
    const operation = await files.save({
      Path: `/tmp/${document.Subject}-${document.Title}.pdf`,
      Blob: payload,
    });
    if (operation.statusCode !== 200) return operation;
    const { Id } = operation.body;
    const updated = await sql.updateFileLinkAndSeal(document.Id, Id);
    if (!updated) return asPayload(500, { message: "Failed to update" });
    return asPayload(200, { message: "Sealed successfully" });
  },
  getById: async (args: InferArgs["getById"]) => {
    const result = await sql.getByIdMaybe(args);
    if (!result) return asPayload(404, { message: "Not found" });
    return asPayload(200, result);
  },
  getByIdWithFile: async (args: InferArgs["getByIdWithFile"]) => {
    const query = await sql.getByIdWithFile(args);
    if (!query) return asPayload(404, { message: "Not found" });
    if (query.Document.TypeState !== TypeStateDocumentKeys.Sealed)
      return asPayload(400, { message: "Not sealed" });
    if (!query.File)
      return asPayload(500, {
        message:
          "The document has no file associated, violation of invariant, all document sealed must be had a file associated",
      });
    const resultGetFileById = await files.private.getLinkById({
      Id: query.File.Id,
      Download: false,
    });
    if (isError(resultGetFileById)) return retrow(resultGetFileById);
    const link = resultGetFileById.body.link;

    return asPayload(200, {
      Document: { ...query.Document },
      File: { ...query.File, Link: link },
    });
  },
  create: async (args: InferArgs["create"]) => {
    const result = await sql.create(args);
    if (!result) return asPayload(500, { message: "Failed to create" });
    return asPayload(200, result);
  },
  updateContent: async (args: InferArgs["updateContent"]) => {
    const query = await sql.getSubjetAndTitleById(args.Id);
    if (!query) return asPayload(404, { message: "Not found" });
    // Only the document is draft state can be updated
    if (query.TypeState !== TypeStateDocumentKeys.Draft)
      return asPayload(400, { message: "Not a draft" });

    // Extract the <Document .../> element very fast using string index, not regex
    const xml = getDocumentHeader(args.Content);
    if (!xml)
      return asPayload(403, {
        message: "The document has not <Document .../> tag",
      });

    // Parse and extract the title and subject properties of document
    const props = getDocumentProps(xml);
    if (props) {
      // Update the title and subject in the database
      if (query.Title !== props.Title || query.Subject !== props.Subject) {
        await sql.updateTitleAndSubjet(args.Id, {
          Title: props.Title,
          Subject: props.Subject,
        });
      }
    }

    const result = await sql.updateContent(args.Id, args);
    if (!result) return asPayload(500, { message: "Failed to update" });
    return asPayload(200, result);
  },
  updateThumbail: async (args: InferArgs["updateThumbail"]) => {
    const result = await sql.updateThumbail(args.Id, args.ThumbnailId);
    if (!result) return asPayload(500, { message: "Failed to update" });
    return asPayload(200, result);
  },
};
