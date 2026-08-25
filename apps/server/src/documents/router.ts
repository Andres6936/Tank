import { publicProcedure } from "~/server/trpc";
import { handle } from "~/utility/response";

import functions from "./functions";
import { Args } from "./args";

export default {
  getAll: publicProcedure.input(Args.getAll).query(
    handle(async (args) => {
      const { input } = args;
      return functions.getAll(input);
    }),
  ),
  getAllInfinite: publicProcedure.input(Args.getAllInfinite).query(
    handle(async (args) => {
      const { input } = args;
      return functions.getAllInfinite(input);
    }),
  ),
  seal: publicProcedure.input(Args.seal).mutation(
    handle(async (args) => {
      const { input } = args;
      return functions.seal(input);
    }),
  ),
  getById: publicProcedure.input(Args.getById).query(
    handle(async (args) => {
      const { input } = args;
      return functions.getById(input);
    }),
  ),
  create: publicProcedure.input(Args.create).mutation(
    handle(async (args) => {
      const { input } = args;
      return functions.create(input);
    }),
  ),
  updateContent: publicProcedure.input(Args.updateContent).mutation(
    handle(async (args) => {
      const { input } = args;
      return functions.updateContent(input);
    }),
  ),
};
