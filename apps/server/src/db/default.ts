import { sql } from "drizzle-orm";
import { text } from "drizzle-orm/sqlite-core";

const defaultId = text()
  .primaryKey()
  .default(sql`(uuid7())`);

const defaultISODate = text()
  .notNull()
  .default(sql`(time_fmt_iso(time_now()))`);

export { defaultId, defaultISODate };
