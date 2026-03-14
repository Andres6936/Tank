import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { FilesTable, type FilesTableInsert } from "./src/db/schema";

const client = createClient({
  url: process.env.LIBSQL_URL!,
  authToken: process.env.LIBSQL_AUTH_TOKEN!,
});
const db = drizzle({ client });

const file: FilesTableInsert = {
  Name: "Text",
  Bucket: "/",
  Path: "hello.txt",
};

await db.insert(FilesTable).values(file);
console.log("File created");
