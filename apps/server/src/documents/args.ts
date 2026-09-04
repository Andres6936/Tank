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
    Author: z.string().min(5),
    Keywords: z.string().min(3),
    Creator: z.string().min(5),
    Producer: z.string().min(1),
    Language: z.string().min(1),
    Type: z.string().min(5),
    Cover: z.string().min(5),
    Month: z.string().min(5),
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
