import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const getSQLClients = () => {
  const clientLibSQL = createClient({
    url: process.env.LIBSQL_URL!,
    authToken: process.env.LIBSQL_AUTH_TOKEN!,
  });
  const sql = drizzle({ client: clientLibSQL });

  return {
    sql,
  };
};

export { getSQLClients };
