import { getSQLClients } from "~/config/clients-sql";
import { TypeStateDocumentKeys } from "~/db/enums";
import { TypeStateDocument } from "~/db/schema";

const { sql } = getSQLClients();

await sql
  .insert(TypeStateDocument)
  .values({
    Type: TypeStateDocumentKeys.Draft,
  })
  .onConflictDoNothing();

await sql
  .insert(TypeStateDocument)
  .values({
    Type: TypeStateDocumentKeys.Sealed,
  })
  .onConflictDoNothing();
