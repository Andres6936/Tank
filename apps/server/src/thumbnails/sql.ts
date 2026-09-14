import { ThumbnailsTable } from "~/db/schema";
import { getSQLClients } from "../config/clients-sql";

const { sql } = getSQLClients();

const save = async (args: { placeholder: string }) => {
  const result = await sql
    .insert(ThumbnailsTable)
    .values({
      PlacelholderHash: args.placeholder,
      Metadata: {},
    })
    .returning();

  if (result.length === 0) return null;
  const [row] = result;
  return row!;
};

export { save };
