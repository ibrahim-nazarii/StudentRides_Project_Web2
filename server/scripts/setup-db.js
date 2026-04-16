const path = require("path");
const dotenv = require("dotenv");

// Monorepo: the `.env` is typically at the repo root, not inside `/server`.
const repoRoot = path.join(__dirname, "..", "..");
const envPaths = [path.join(repoRoot, ".env"), path.join(repoRoot, "env.example")];
let lastError;
for (const p of envPaths) {
  const result = dotenv.config({ path: p });
  if (!result.error) break;
  lastError = result.error;
}
if (lastError) {
  // eslint-disable-next-line no-console
  console.warn("Warning: could not load env file:", lastError.message);
}

const knexConfig = require("../knexfile");
const knexFactory = require("knex");

function getEnvConfig() {
  const env = process.env.NODE_ENV || "development";
  const cfg = knexConfig[env];
  if (!cfg || !cfg.connection) {
    throw new Error(`Missing Knex config for env=${env} or NEON_DATABASE_URL.`);
  }
  return cfg;
}

async function main() {
  const knex = knexFactory(getEnvConfig());

  try {
    console.log("Running migrations...");
    await knex.migrate.latest();

    console.log("Seeding demo data...");
    await knex.seed.run();

    console.log("Database setup complete.");
  } finally {
    await knex.destroy();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

