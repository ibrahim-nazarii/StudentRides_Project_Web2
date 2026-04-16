# Student Rides Sharing (Web2)

## Stack

- Backend: Node.js 14 + Express (REST API)
- Frontend: Vue 3 (Vite) + Pinia + Vue Router
- Database: Neon Postgres + **Knex** (migrations + seeds)
- Auth: bcrypt-hashed passwords + cookie-based sessions (`httpOnly`, `Secure`, `SameSite=Lax`)

### Why Knex?

Knex is a lightweight SQL query builder that fits well with Neon Postgres and this assignment’s requirements for SQL DDL + migration + seed scripts, while keeping the backend implementation simple and consistent in Node.js.

## Local Setup, How to Start

1. Install dependencies:
   - `pnpm install`

2. Configure environment variables:
   - Create a `.env` file from `env.example` (sandbox limitation: it blocked creating `.env.example`) \***\* ENV ISN'T NEEDED FOR THE SAKE OF SIMPLICITY AND OUT OF BOX, READINESS \*\***

   ## NEON DATABASE URL HAS BEEN HARCODED, NOTHING TO DO HERE, NEXT STEP

3. Run the backend:
   - `pnpm -C server dev`
4. Run the frontend:
   - `pnpm -C client dev`

## For New Neon Database Setup

Create the database schema and seed demo users:

- `pnpm -C server setup-db`

## Neon Setup Notes

Create a Neon project/branch using the Neon CLI, then set:

- `NEON_DATABASE_URL` in `.env`

The schema + seeds are handled by Knex migration + seed:

- Migration: `server/db/migrations/001_init_schema.js` (runs `server/db/schema.sql`)
- Seed: `server/db/seeds/01_demo_users.js`

## Demo login

Two demo users are created with the password:

- `demo1234`

Emails:

- `alice@example.com`
- `bob@example.com`
