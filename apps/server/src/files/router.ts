import { z } from "zod";

import { publicProcedure } from "~/server/trpc";
import { handle } from "~/utility/response";
import { PaginateSchema } from "~/schemas/general";

import functions from "./functions";

export default {
  getAll: publicProcedure.input(z.optional(PaginateSchema)).query(
    handle(async (args) => {
      const { input } = args;
      return functions.getAll(input);
    }),
  ),
  save: publicProcedure.input(z.instanceof(FormData)).mutation(
    handle(async (args) => {
      const { input } = args;
      return functions.save(input);
    }),
  ),
  getById: publicProcedure.input(z.uuidv7()).query(async (args) => {
    const { input: id } = args;
    return functions.getById(id);
  }),
  updateById: publicProcedure.input(z.instanceof(FormData)).mutation(
    handle(async (args) => {
      const { input } = args;
      return functions.updateById(input);
    }),
  ),
  deleteById: publicProcedure.input(z.uuidv7()).mutation(async (args) => {
    const { input: id } = args;
    return functions.deleteById(id);
  }),
};
