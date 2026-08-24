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
  generate: publicProcedure.input(Args.generate).mutation(
    handle(async (args) => {
      const { input } = args;
      return functions.generate(args);
    }),
  ),
  getById: publicProcedure.input(Args.getById).query(
    handle(async (args) => {
      const { input } = args;
      return functions.getById(input);
    }),
  ),
};
