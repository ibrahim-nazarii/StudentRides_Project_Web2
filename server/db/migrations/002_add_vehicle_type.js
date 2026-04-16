const VALID_TYPES = ["Car", "Motorcycle", "Van", "Electric Car", "Scooter"];

module.exports = {
  async up(knex) {
    const hasColumn = await knex.schema.hasColumn("rides", "vehicle_type");
    if (!hasColumn) {
      await knex.schema.alterTable("rides", (table) => {
        table
          .text("vehicle_type")
          .notNullable()
          .defaultTo("Car")
          .checkIn(VALID_TYPES, "rides_vehicle_type_check");
      });
    }
  },

  async down(knex) {
    const hasColumn = await knex.schema.hasColumn("rides", "vehicle_type");
    if (hasColumn) {
      await knex.schema.alterTable("rides", (table) => {
        table.dropColumn("vehicle_type");
      });
    }
  }
};
