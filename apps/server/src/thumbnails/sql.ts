import { ThumbnailsTable } from "~/db/schema";
import { getSQLClients } from "../config/clients-sql";
import { eq } from "drizzle-orm";

const { sql } = getSQLClients();

const getById = async (id: string) => {
  const result = await sql
    .select()
    .from(ThumbnailsTable)
    .where(eq(ThumbnailsTable.Id, id))
    .limit(1);

  if (result.length === 0) return null;
  const [row] = result;
  return row!;
};

const save = async (args: { placeholder: string; lowFileId: string }) => {
  const result = await sql
    .insert(ThumbnailsTable)
    .values({
      PlacelholderHash: args.placeholder,
      LowFileId: args.lowFileId,
      Metadata: {},
    })
    .returning({ Id: ThumbnailsTable.Id });

  if (result.length === 0) return null;
  const [row] = result;
  return row!;
};

const update = async (args: {
  id: string;
  placeholder: string;
  lowFileId: string | null;
}) => {
  const result = await sql
    .update(ThumbnailsTable)
    .set({
      PlacelholderHash: args.placeholder,
      LowFileId: args.lowFileId,
    })
    .where(eq(ThumbnailsTable.Id, args.id))
    .returning({ Id: ThumbnailsTable.Id });

  if (result.length === 0) return null;
  const [row] = result;
  return row!;
};

export { getById, save, update };
