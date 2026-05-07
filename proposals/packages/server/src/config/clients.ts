import { S3Client } from "bun";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const getVaultsClients = () => {
  const privateVault = new S3Client({
    endpoint: "https://s3sea.andres6936.dev/",
    accessKeyId: process.env.SEAWEEDFS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SEAWEEDFS_ACCESS_SECRET_KEY,
    bucket: "private",
  });

  const ephemeralVault = new S3Client({
    endpoint: "https://s3sea.andres6936.dev/",
    accessKeyId: process.env.SEAWEEDFS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SEAWEEDFS_ACCESS_SECRET_KEY,
    bucket: "ephemeral",
  });

  return {
    privateVault,
    ephemeralVault,
  };
};

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

export { getSQLClients, getVaultsClients };
