import { env } from "~/utils/env";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const pool = new pg.Pool({ connectionString: env.DATABASE_URL });
const database = drizzle(pool, { schema });

export { database, pool };
