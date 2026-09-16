import { z } from "zod";
import { handle } from "~/utility/response";
import { publicProcedure } from "~/server/trpc";
import { SaveFileSchema, UpdateFileSchema } from "~/schemas/validate";

import functions from "./functions";
import { PrivateArgs } from "./args";

export default {
  private: {
    getAll: publicProcedure.input(PrivateArgs.getAll).query(
      handle(async (args) => {
        const { input } = args;
        return functions.private.getAll(input);
      }),
    ),
    save: publicProcedure.input(z.instanceof(FormData)).mutation(
      handle(async (args) => {
        const { input } = args;
        return functions.private.save(
          SaveFileSchema.parse(Object.fromEntries(input.entries())),
        );
      }),
    ),
    getById: publicProcedure.input(PrivateArgs.getById).query(
      handle(async (args) => {
        const { input: id } = args;
        return functions.private.getById(id);
      }),
    ),
    updateById: publicProcedure.input(z.instanceof(FormData)).mutation(
      handle(async (args) => {
        const { input } = args;
        return functions.private.updateById(
          UpdateFileSchema.parse(Object.fromEntries(input.entries())),
        );
      }),
    ),
    deleteById: publicProcedure.input(PrivateArgs.deleteById).mutation(
      handle(async (args) => {
        const { input: id } = args;
        return functions.private.deleteById(id);
      }),
    ),
  },
};
