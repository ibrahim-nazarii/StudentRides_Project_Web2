const knexFactory = require("knex");
const knexConfig = require("../../knexfile");

let db;

function getKnexEnv() {
  return process.env.NODE_ENV || "development";
}

function getDb() {
  if (db) return db;
  const env = getKnexEnv();
  const cfg = knexConfig[env];
  if (!cfg) {
    throw new Error(`No knex config found for NODE_ENV=${env}`);
  }
  db = knexFactory(cfg);
  return db;
}

module.exports = { getDb };

