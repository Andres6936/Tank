import { z } from "zod";
import { PaginateSchema } from "~/schemas/general";

import schemas from "./schemas";

export const Args = {
  getAll: z.optional(PaginateSchema),
  getAllInfinite: z.object({
    limit: z.number(),
    cursor: z.string().nullish(),
  }),
  seal: z.uuid(),
  getById: z.uuid(),
  create: z.object({
    Title: z.string().min(5),
    Subject: z.string().min(5),
    Author: z.string(),
    Keywords: z.string(),
    Creator: z.string(),
    Producer: z.string(),
    Language: z.string(),
    Type: z.string(),
    Cover: z.string(),
    Month: z.string(),
  }),
  updateContent: schemas.Update.extend({ Id: z.uuid() })
    .pick({
      Id: true,
      Content: true,
    })
    .required(),
};

export type InferArgs = {
  [K in keyof typeof Args]: z.infer<(typeof Args)[K]>;
};
