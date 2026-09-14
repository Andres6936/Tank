import { z } from "zod";

export const Args = {
  save: z.object({
    placeholder: z.string(),
  }),
};

export type InferArgs = {
  [K in keyof typeof Args]: z.infer<(typeof Args)[K]>;
};
