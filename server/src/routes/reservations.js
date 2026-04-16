const express = require("express");

const router = express.Router();

const { getDb } = require("../db/knex");

// List reservations for the current user.
router.get("/mine", async (req, res) => {
  const db = getDb();
  const user = req.session.user;
  const passengerId = user?.id;
  if (!passengerId) return res.status(401).json({ error: "Unauthorized" });

  const reservations = await db("reservations")
    .join("rides", "reservations.ride_id", "rides.id")
    .join("users as driver", "rides.driver_id", "driver.id")
    .select(
      "reservations.id as reservation_id",
      "reservations.ride_id",
      "reservations.passenger_id",
      "reservations.reserved_at",
      "rides.departure_time",
      "rides.origin",
      "rides.destination",
      "rides.vehicle_type",
      "driver.name as driver_name",
      "rides.seats_total",
      "rides.seats_available"
    )
    .where("reservations.passenger_id", passengerId)
    .orderBy("reservations.reserved_at", "desc");

  return res.json({ reservations });
});

router.delete("/:id", async (req, res) => {
  const db = getDb();
  const user = req.session.user;
  const passengerId = user?.id;
  const reservationId = req.params.id;

  if (!passengerId) return res.status(401).json({ error: "Unauthorized" });

  try {
    await db.transaction(async (trx) => {
      const reservation = await trx("reservations").where({ id: reservationId }).first();
      if (!reservation) {
        const err = new Error("Reservation not found");
        err.status = 404;
        throw err;
      }
      if (reservation.passenger_id !== passengerId) {
        const err = new Error("Forbidden");
        err.status = 403;
        throw err;
      }

      // Lock ride while updating seat count.
      const ride = await trx("rides").where({ id: reservation.ride_id }).forUpdate().first();
      if (!ride) {
        const err = new Error("Ride not found");
        err.status = 404;
        throw err;
      }

      await trx("reservations").where({ id: reservationId }).del();
      await trx("rides")
        .where({ id: reservation.ride_id })
        .update({ seats_available: trx.raw("seats_available + 1") });
    });

    return res.status(204).send();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(err.status || 500).json({ error: err.message || "Delete failed" });
  }
});

module.exports = router;

