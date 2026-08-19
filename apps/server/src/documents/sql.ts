import { eq } from "drizzle-orm";

import { getSQLClients } from "~/config/clients-sql";
import { DocumentsTable } from "~/db/schema";

const { sql } = getSQLClients();

const getByIdMaybe = async (id: string) => {
  const result = await sql
    .select()
    .from(DocumentsTable)
    .where(eq(DocumentsTable.Id, id))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  const [row] = result;
  return row;
};

export { getByIdMaybe };
