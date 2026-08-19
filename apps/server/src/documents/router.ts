import { publicProcedure } from "~/server/trpc";
import { handle } from "~/utility/response";

import { getByIdMaybe } from "./sql";

export default {
  generate: publicProcedure.mutation(
    handle(async (args) => {
      const result = await getByIdMaybe("01a012c2-cc97-771d-bc93-d91c0de027e9");
      if (!result) throw new Error("Not found");

      const stream = await fetch("http://localhost:6936/api/documents", {
        method: "POST",
        body: JSON.stringify({
          xml: result.Content,
          seal: "green",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!stream.ok) throw new Error("Failed to generate");
      const payload = await stream.arrayBuffer();
      await Bun.write("out.pdf", payload);
      return { success: true };
    }),
  ),
};
