import { ThumbnailsTable } from "~/db/schema";
import { getSQLClients } from "../config/clients-sql";
import { eq } from "drizzle-orm";

const { sql } = getSQLClients();

const save = async (args: { placeholder: string }) => {
  const result = await sql
    .insert(ThumbnailsTable)
    .values({
      PlacelholderHash: args.placeholder,
      Metadata: {},
    })
    .returning({ Id: ThumbnailsTable.Id });

  if (result.length === 0) return null;
  const [row] = result;
  return row!;
};

const update = async (args: { id: string; placeholder: string }) => {
  const result = await sql
    .update(ThumbnailsTable)
    .set({
      PlacelholderHash: args.placeholder,
    })
    .where(eq(ThumbnailsTable.Id, args.id))
    .returning({ Id: ThumbnailsTable.Id });

  if (result.length === 0) return null;
  const [row] = result;
  return row!;
};

export { save, update };
