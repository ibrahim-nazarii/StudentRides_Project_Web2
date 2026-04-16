const bcrypt = require("bcrypt");

const DEMO_PASSWORD = "demo1234";

exports.seed = async function seed(knex) {
  // Keep seeds idempotent.
  await knex("reservations").del().catch(() => {});
  await knex("rides").del().catch(() => {});
  await knex("users").del();

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  await knex("users").insert([
    { name: "Alice Driver", email: "alice@example.com", password_hash: passwordHash },
    { name: "Bob Passenger", email: "bob@example.com", password_hash: passwordHash }
  ]);
};

