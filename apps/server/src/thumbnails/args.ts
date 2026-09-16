import { z } from "zod";

export const Args = {
  save: z.object({
    placeholder: z.string(),
    lowFileId: z.uuid(),
  }),
  update: z.object({
    id: z.uuid(),
    placeholder: z.string(),
    lowFileId: z.uuid(),
  }),
};

export type InferArgs = {
  [K in keyof typeof Args]: z.infer<(typeof Args)[K]>;
};
