import { z } from "zod";
import { PaginateSchema } from "~/schemas/general";

import schemas from "./schemas";

export const Args = {
  getAll: z.optional(PaginateSchema),
  seal: z.uuid(),
  getById: z.uuid(),
  create: schemas.Insert.required({
    Title: true,
    Subject: true,
    Content: true,
  }),
  updateContent: schemas.Update.extend({ Id: z.uuid() })
    .pick({
      Id: true,
      Title: true,
      Subject: true,
      Content: true,
    })
    .required(),
};

export type InferArgs = {
  [K in keyof typeof Args]: z.infer<(typeof Args)[K]>;
};
