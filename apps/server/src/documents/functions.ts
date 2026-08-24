import { asPayload } from "~/utility/response";
import { TypeStateDocumentKeys } from "~/db/enums";

import files from "~/files/functions";
import { type InferArgs } from "./args";
import * as sql from "./sql";

export default {
  getAll: async (args: InferArgs["getAll"]) => {
    const result = await sql.getAll(args);
    return asPayload(200, result);
  },
  seal: async (args: InferArgs["seal"]) => {
    const result = await sql.getByIdMaybe(args);
    if (!result) return asPayload(404, { message: "Not found" });
    const document = result;
    if (document.TypeState !== TypeStateDocumentKeys.Draft) {
      return asPayload(401, { message: "Document is not in draft state" });
    }
    const stream = await fetch("http://localhost:6936/api/documents", {
      method: "POST",
      body: JSON.stringify({
        xml: document.Content,
        seal: "red",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
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
  create: async (args: InferArgs["create"]) => {
    const result = await sql.create(args);
    if (!result) return asPayload(500, { message: "Failed to create" });
    return asPayload(200, result);
  },
  updateContent: async (args: InferArgs["updateContent"]) => {
    const result = await sql.updateContent(args.Id, args);
    if (!result) return asPayload(500, { message: "Failed to update" });
    return asPayload(200, result);
  },
};
