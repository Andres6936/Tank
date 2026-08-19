import { publicProcedure } from "~/server/trpc";
import { handle } from "~/utility/response";

import functions, { Args } from "./functions";

export default {
  getAll: publicProcedure.input(Args.getAll).query(
    handle(async (args) => {
      const { input } = args;
      return functions.getAll(input);
    }),
  ),
  save: publicProcedure.input(Args.save).mutation(
    handle(async (args) => {
      const { input } = args;
      return functions.save(input);
    }),
  ),
  getById: publicProcedure.input(Args.getById).query(
    handle(async (args) => {
      const { input: id } = args;
      return functions.getById(id);
    }),
  ),
  updateById: publicProcedure.input(Args.updateById).mutation(
    handle(async (args) => {
      const { input } = args;
      return functions.updateById(input);
    }),
  ),
  deleteById: publicProcedure.input(Args.deleteById).mutation(
    handle(async (args) => {
      const { input: id } = args;
      return functions.deleteById(id);
    }),
  ),
};
