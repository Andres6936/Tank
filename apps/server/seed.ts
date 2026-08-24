import { getSQLClients } from "~/config/clients-sql";
import { TypeStateDocumentKeys } from "~/db/enums";
import { TypeStateDocument } from "~/db/schema";

const { sql } = getSQLClients();

for (const Type of Object.values(TypeStateDocumentKeys)) {
  await sql
    .insert(TypeStateDocument)
    .values({
      Type,
    })
    .onConflictDoNothing();
}
