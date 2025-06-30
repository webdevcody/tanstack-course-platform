import "dotenv/config";

import { migrate } from "drizzle-orm/postgres-js/migrator";
import { database, pool } from "./index";

async function main() {
  await migrate(database, { migrationsFolder: "drizzle" });
  await pool.end();
}

main();
