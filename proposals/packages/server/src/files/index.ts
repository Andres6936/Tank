import { eq } from "drizzle-orm";

import { getClients } from "../config/clients";
import { FilesTable, type FilesTableInsert } from "../db/schema";

const { sql } = getClients();

const existPath = async (
  path: string,
): Promise<[true, string] | [false, null]> => {
  const result = await sql
    .select({ Id: FilesTable.Id })
    .from(FilesTable)
    .where(eq(FilesTable.Path, path))
    .limit(1);

  if (result.length > 0) {
    return [true, result[0]!.Id];
  }
  return [false, null];
};

const existFile = async (id: string) => {
  const result = await sql
    .select({ Id: FilesTable.Id })
    .from(FilesTable)
    .where(eq(FilesTable.Id, id))
    .limit(1);
  return result.length > 0;
};

const getFileMaybe = async (id: string) => {
  const result = await sql
    .select()
    .from(FilesTable)
    .where(eq(FilesTable.Id, id))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  const [row] = result;
  return row;
};

const insertFile = async (schema: FilesTableInsert) => {
  return await sql
    .insert(FilesTable)
    .values({
      Name: schema.Name,
      Path: schema.Path,
      Bucket: schema.Bucket,
      Mimetype: schema.Mimetype,
    })
    .returning({ Id: FilesTable.Id });
};

const updateFile = async (id: string, schema: FilesTableInsert) => {
  return await sql
    .update(FilesTable)
    .set({
      Name: schema.Name,
      Path: schema.Path,
      Bucket: schema.Bucket,
      Mimetype: schema.Mimetype,
    })
    .where(eq(FilesTable.Id, id))
    .returning({ Id: FilesTable.Id });
};

const deleteFile = async (id: string) => {
  const result = await sql
    .delete(FilesTable)
    .where(eq(FilesTable.Id, id))
    .returning({ Id: FilesTable.Id });

  if (result.length === 0) {
    return null;
  }

  const [row] = result;
  return row;
};

export {
  existPath,
  existFile,
  getFileMaybe,
  insertFile,
  updateFile,
  deleteFile,
};
