const NEON_DATABASE_URL =
  "postgresql://neondb_owner:npg_2gIWxCEqFPB6@ep-misty-credit-ag3wvl8e-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const shared = {
  client: "pg",
  connection: NEON_DATABASE_URL,
  migrations: {
    directory: "./db/migrations",
    tableName: "knex_migrations"
  },
  seeds: {
    directory: "./db/seeds",
    tableName: "knex_seeds"
  }
};

module.exports = {
  development: shared,
  test: shared,
  production: shared
};

