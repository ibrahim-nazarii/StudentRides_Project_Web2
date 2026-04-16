const express = require("express");

const router = express.Router();

const { getDb } = require("../db/knex");

const VEHICLE_TYPES = ["Car", "Motorcycle", "Van", "Electric Car", "Scooter"];

const RIDE_COLUMNS = [
  "id",
  "driver_id",
  "departure_time",
  "origin",
  "destination",
  "vehicle_type",
  "seats_total",
  "seats_available",
  "created_at"
];

function parseDepartureTime(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

router.post("/", async (req, res) => {
  const { departure_time, origin, destination, vehicle_type, seats_total } = req.body || {};
  const user = req.session.user;

  if (!user?.id) return res.status(401).json({ error: "Unauthorized" });
  if (!departure_time) return res.status(400).json({ error: "Missing departure_time" });
  if (!origin || typeof origin !== "string") return res.status(400).json({ error: "Missing origin" });
  if (!destination || typeof destination !== "string")
    return res.status(400).json({ error: "Missing destination" });

  const departureISO = parseDepartureTime(departure_time);
  if (!departureISO) return res.status(400).json({ error: "Invalid departure_time" });
  if (new Date(departureISO) <= new Date()) return res.status(400).json({ error: "Departure time must be in the future" });

  const vehicleType = vehicle_type || "Car";
  if (!VEHICLE_TYPES.includes(vehicleType))
    return res.status(400).json({ error: `Invalid vehicle_type. Must be one of: ${VEHICLE_TYPES.join(", ")}` });

  const total = Number(seats_total);
  if (!Number.isInteger(total) || total <= 0) return res.status(400).json({ error: "Invalid seats_total" });

  const db = getDb();
  const inserted = await db("rides")
    .insert({
      driver_id: user.id,
      departure_time: departureISO,
      origin,
      destination,
      vehicle_type: vehicleType,
      seats_total: total,
      seats_available: total
    })
    .returning(RIDE_COLUMNS);

  const ride = Array.isArray(inserted) ? inserted[0] : inserted;
  return res.status(201).json({ ride });
});

// Upcoming rides. If `?mine=1`, only return rides owned by the current driver.
router.get("/", async (req, res) => {
  const db = getDb();
  const user = req.session.user;

  const mine = req.query.mine === "1" || req.query.mine === "true";
  const now = new Date();

  const query = db("rides")
    .join("users as driver", "rides.driver_id", "driver.id")
    .select(
      "rides.id",
      "rides.driver_id",
      "driver.name as driver_name",
      "rides.departure_time",
      "rides.origin",
      "rides.destination",
      "rides.vehicle_type",
      "rides.seats_total",
      "rides.seats_available",
      "rides.created_at"
    )
    .where("rides.departure_time", ">", now)
    .orderBy("rides.departure_time", "asc");

  if (mine) {
    if (!user?.id) return res.status(401).json({ error: "Unauthorized" });
    query.where("rides.driver_id", user.id);
  }

  const rides = await query;
  return res.json({ rides });
});

router.patch("/:id", async (req, res) => {
  const db = getDb();
  const user = req.session.user;
  const rideId = req.params.id;

  const { departure_time, origin, destination, vehicle_type, seats_total } = req.body || {};

  const ride = await db("rides")
    .where({ id: rideId, driver_id: user.id })
    .first();

  if (!ride) return res.status(404).json({ error: "Ride not found" });

  const patch = {};

  if (departure_time !== undefined) {
    const departureISO = parseDepartureTime(departure_time);
    if (!departureISO) return res.status(400).json({ error: "Invalid departure_time" });
    patch.departure_time = departureISO;
  }
  if (origin !== undefined) {
    if (!origin || typeof origin !== "string") return res.status(400).json({ error: "Invalid origin" });
    patch.origin = origin;
  }
  if (destination !== undefined) {
    if (!destination || typeof destination !== "string")
      return res.status(400).json({ error: "Invalid destination" });
    patch.destination = destination;
  }
  if (vehicle_type !== undefined) {
    if (!VEHICLE_TYPES.includes(vehicle_type))
      return res.status(400).json({ error: `Invalid vehicle_type. Must be one of: ${VEHICLE_TYPES.join(", ")}` });
    patch.vehicle_type = vehicle_type;
  }

  // Updating `seats_total` requires recalculating `seats_available`.
  if (seats_total !== undefined) {
    const newTotal = Number(seats_total);
    if (!Number.isInteger(newTotal) || newTotal <= 0) return res.status(400).json({ error: "Invalid seats_total" });
    const reservedSeats = Number(ride.seats_total) - Number(ride.seats_available);
    const newAvailable = newTotal - reservedSeats;
    if (newAvailable < 0) {
      return res.status(400).json({ error: "seats_total too small for existing reservations" });
    }
    patch.seats_total = newTotal;
    patch.seats_available = newAvailable;
  }

  if (Object.keys(patch).length === 0) return res.status(400).json({ error: "No fields to update" });

  const updated = await db("rides")
    .where({ id: rideId, driver_id: user.id })
    .update(patch)
    .returning(RIDE_COLUMNS);

  const newRide = Array.isArray(updated) ? updated[0] : updated;
  return res.json({ ride: newRide });
});

router.delete("/:id", async (req, res) => {
  const db = getDb();
  const user = req.session.user;
  const rideId = req.params.id;

  const ride = await db("rides").where({ id: rideId, driver_id: user.id }).first();
  if (!ride) return res.status(404).json({ error: "Ride not found" });

  await db("rides").where({ id: rideId, driver_id: user.id }).del();
  return res.status(204).send();
});

// POST /rides/:id/reservations
router.post("/:id/reservations", async (req, res) => {
  const db = getDb();
  const passenger = req.session.user;
  const rideId = req.params.id;

  if (!passenger?.id) return res.status(401).json({ error: "Unauthorized" });

  let reservationId;

  try {
    await db.transaction(async (trx) => {
      const ride = await trx("rides").where({ id: rideId }).forUpdate().first();
      if (!ride) {
        const err = new Error("Ride not found");
        err.status = 404;
        throw err;
      }

      if (ride.driver_id === passenger.id) {
        const err = new Error("Driver cannot reserve their own ride");
        err.status = 400;
        throw err;
      }

      if (Number(ride.seats_available) <= 0) {
        const err = new Error("No seats available");
        err.status = 409;
        throw err;
      }

      const existing = await trx("reservations")
        .where({ ride_id: rideId, passenger_id: passenger.id })
        .first();
      if (existing) {
        const err = new Error("You already reserved this ride");
        err.status = 409;
        throw err;
      }

      const inserted = await trx("reservations")
        .insert({ ride_id: rideId, passenger_id: passenger.id })
        .returning(["id"]);

      const row = Array.isArray(inserted) ? inserted[0] : inserted;
      reservationId = row.id;

      // Decrement seats after successful reservation insert.
      await trx("rides")
        .where({ id: rideId })
        .update({ seats_available: trx.raw("seats_available - 1") });
    });

    return res.status(201).json({ reservationId });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(err.status || 500).json({ error: err.message || "Reservation failed" });
  }
});

module.exports = router;
