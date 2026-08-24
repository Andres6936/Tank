import { z } from "zod";
import { PaginateSchema } from "~/schemas/general";
import { asPayload } from "~/utility/response";

import schemas from "./schemas";
import * as sql from "./sql";

export const Args = {
  getAll: z.optional(PaginateSchema),
  generate: z.any(),
  getById: z.uuidv7(),
  create: schemas.Insert,
};

type InferArgs = {
  [K in keyof typeof Args]: z.infer<(typeof Args)[K]>;
};

export default {
  getAll: async (args: InferArgs["getAll"]) => {
    const result = await sql.getAll(args);
    return asPayload(200, result);
  },
  generate: async (args: InferArgs["generate"]) => {
    const result = await sql.getByIdMaybe(
      "01a012c2-cc97-771d-bc93-d91c0de027e9",
    );
    if (!result) throw new Error("Not found");

    const stream = await fetch("http://localhost:6936/api/documents", {
      method: "POST",
      body: JSON.stringify({
        xml: result.Content,
        seal: "green",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!stream.ok) throw new Error("Failed to generate");
    const payload = await stream.arrayBuffer();
    await Bun.write("out.pdf", payload);
    return { success: true };
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
};
