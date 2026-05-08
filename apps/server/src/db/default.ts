import { sql } from "drizzle-orm";
import { text } from "drizzle-orm/sqlite-core";

const defaultId = text("Id")
  .primaryKey()
  .default(sql`(uuid7())`);

const defaultISODate = text("CreatedAt")
  .notNull()
  .default(sql`(time_fmt_iso(time_now()))`);

export { defaultId, defaultISODate };
