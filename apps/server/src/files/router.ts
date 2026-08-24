import { z } from "zod";
import { handle } from "~/utility/response";
import { publicProcedure } from "~/server/trpc";
import { SaveFileSchema, UpdateFileSchema } from "~/schemas/validate";

import functions from "./functions";
import { Args } from "./args";

export default {
  getAll: publicProcedure.input(Args.getAll).query(
    handle(async (args) => {
      const { input } = args;
      return functions.getAll(input);
    }),
  ),
  save: publicProcedure.input(z.instanceof(FormData)).mutation(
    handle(async (args) => {
      const { input } = args;
      return functions.save(
        SaveFileSchema.parse(Object.fromEntries(input.entries())),
      );
    }),
  ),
  getById: publicProcedure.input(Args.getById).query(
    handle(async (args) => {
      const { input: id } = args;
      return functions.getById(id);
    }),
  ),
  updateById: publicProcedure.input(z.instanceof(FormData)).mutation(
    handle(async (args) => {
      const { input } = args;
      return functions.updateById(
        UpdateFileSchema.parse(Object.fromEntries(input.entries())),
      );
    }),
  ),
  deleteById: publicProcedure.input(Args.deleteById).mutation(
    handle(async (args) => {
      const { input: id } = args;
      return functions.deleteById(id);
    }),
  ),
};
