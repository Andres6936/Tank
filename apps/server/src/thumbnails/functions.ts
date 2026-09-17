import { asPayload } from "~/utility/response";

import * as sql from "./sql";
import { type InferArgs } from "./args";

export default {
  getById: async (args: InferArgs["getById"]) => {
    const result = await sql.getById(args);
    if (!result)
      return asPayload(404, {
        message: "Thumbnail not found",
      });
    return asPayload(200, result);
  },
  save: async (args: InferArgs["save"]) => {
    const result = await sql.save(args);
    if (!result)
      return asPayload(403, {
        message: "Cannot save the thumbnail",
      });
    return asPayload(200, result);
  },
  update: async (args: InferArgs["update"]) => {
    const result = await sql.update(args);
    if (!result)
      return asPayload(403, {
        message: "Cannot update the thumbnail",
      });
    return asPayload(200, result);
  },
};
