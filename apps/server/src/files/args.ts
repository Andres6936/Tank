import { z } from "zod";

import { PaginateSchema } from "~/schemas/general";
import { SaveFileSchema, UpdateFileSchema } from "~/schemas/validate";

export const Args = {
  getAll: z.optional(PaginateSchema),
  save: SaveFileSchema,
  getById: z.uuid(),
  getLinkById: z.object({
    Id: z.uuid(),
    Download: z.boolean(),
  }),
  updateById: UpdateFileSchema,
  deleteById: z.uuid(),
};

export type InferArgs = {
  [K in keyof typeof Args]: z.infer<(typeof Args)[K]>;
};
