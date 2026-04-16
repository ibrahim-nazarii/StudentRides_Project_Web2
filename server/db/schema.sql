-- Database schema for the student rides-sharing platform.
-- Neon Postgres + Knex migrations.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  departure_time TIMESTAMPTZ NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  vehicle_type TEXT NOT NULL DEFAULT 'Car'
    CHECK (vehicle_type IN ('Car', 'Motorcycle', 'Van', 'Electric Car', 'Scooter')),
  seats_total INTEGER NOT NULL CHECK (seats_total > 0),
  seats_available INTEGER NOT NULL CHECK (seats_available >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS rides_departure_time_idx ON rides(departure_time);

CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  passenger_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reserved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT reservations_ride_passenger_unique UNIQUE (ride_id, passenger_id)
);

CREATE INDEX IF NOT EXISTS reservations_ride_id_idx ON reservations(ride_id);
CREATE INDEX IF NOT EXISTS reservations_passenger_id_idx ON reservations(passenger_id);

