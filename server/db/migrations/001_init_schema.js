const fs = require("fs");
const path = require("path");

function readSchemaSql() {
  const schemaPath = path.join(__dirname, "..", "schema.sql");
  return fs.readFileSync(schemaPath, "utf8");
}

module.exports = {
  async up(knex) {
    // Apply schema in one go so it stays close to the assignment's SQL DDL requirement.
    const sql = readSchemaSql();
    await knex.raw(sql);
  },

  async down(knex) {
    // Best-effort rollback (useful in local dev/test).
    await knex.schema.raw(`
      DROP TABLE IF EXISTS reservations;
      DROP TABLE IF EXISTS rides;
      DROP TABLE IF EXISTS users;
    `);
  }
};

