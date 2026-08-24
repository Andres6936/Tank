import { z } from "zod";

import { PaginateSchema } from "~/schemas/general";

export const Args = {
  getAll: z.optional(PaginateSchema),
  save: z.instanceof(FormData),
  getById: z.uuidv7(),
  updateById: z.instanceof(FormData),
  deleteById: z.uuidv7(),
};

export type InferArgs = {
  [K in keyof typeof Args]: z.infer<(typeof Args)[K]>;
};
