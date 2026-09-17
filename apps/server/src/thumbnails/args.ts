import { z } from "zod";

export const Args = {
  getById: z.uuid(),
  save: z.object({
    placeholder: z.string(),
    lowFileId: z.uuid(),
  }),
  update: z.object({
    id: z.uuid(),
    placeholder: z.string(),
    lowFileId: z.uuid().nullable(),
  }),
};

export type InferArgs = {
  [K in keyof typeof Args]: z.infer<(typeof Args)[K]>;
};
