import { z } from "zod";

import { PaginateSchema } from "~/schemas/general";
import { SaveFileSchema, UpdateFileSchema } from "~/schemas/validate";

export const PrivateArgs = {
  getAll: z.optional(PaginateSchema),
  save: SaveFileSchema,
  getById: z.uuid(),
  getBufferByPath: z.string(),
  getLinkById: z.object({
    Id: z.uuid(),
    Download: z.boolean(),
  }),
  updateById: UpdateFileSchema,
  deleteById: z.uuid(),
};

export type InferPrivateArgs = {
  [K in keyof typeof PrivateArgs]: z.infer<(typeof PrivateArgs)[K]>;
};

export const PublicArgs = {
  save: SaveFileSchema,
};

export type InferPublicArgs = {
  [K in keyof typeof PublicArgs]: z.infer<(typeof PublicArgs)[K]>;
};
