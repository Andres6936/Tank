import { S3Client } from "bun";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const getClients = () => {
  const vault = new S3Client({
    endpoint: "https://s3sea.andres6936.dev/",
    accessKeyId: process.env.SEAWEEDFS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SEAWEEDFS_ACCESS_SECRET_KEY,
    bucket: "private",
  });

  const clientLibSQL = createClient({
    url: process.env.LIBSQL_URL!,
    authToken: process.env.LIBSQL_AUTH_TOKEN!,
  });
  const sql = drizzle({ client: clientLibSQL });

  return {
    vault,
    sql,
  };
};

export { getClients };
