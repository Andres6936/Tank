import { asPayload, isError, retrow } from "~/utility/response";
import { TypeStateDocumentKeys } from "~/db/enums";

import files from "~/files/functions";
import { type InferArgs } from "./args";
import * as sql from "./sql";

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
    const result = await sql.getByIdMaybe(args);
    if (!result) return asPayload(404, { message: "Not found" });
    const document = result;
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
      Path: `/tmp/${document.Title}.pdf`,
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
    const resultGetFileById = await files.getLinkById({
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
    const query = await sql.getStateById(args.Id);
    if (!query) return asPayload(404, { message: "Not found" });
    // Only the document is draft state can be updated
    if (query.TypeState !== TypeStateDocumentKeys.Draft)
      return asPayload(400, { message: "Not a draft" });

    const result = await sql.updateContent(args.Id, args);
    if (!result) return asPayload(500, { message: "Failed to update" });
    return asPayload(200, result);
  },
};
