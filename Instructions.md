🚀 **Context**

You are a senior full-stack engineer.  
Your mission is to scaffold and implement a student rides-sharing web platform for the :contentReference[oaicite:2]{index=2} community.  
Tech stack (must-use):

- **Backend** : Node 14 + Express.js (REST API)
- **Frontend** : Vue 3 (Vite) – single-page application
- **Database** : Neon Postgres (cloud) accessed with a lightweight query builder (Knex or Prisma; pick one and explain choice)
- **Auth** : bcrypt-hashed passwords, cookie-based sessions (HTTP-only, Secure, SameSite=Lax)

Target pages/components (minimum):

1. Home (logo, hero image, menu links to Auth & About)  
2. Auth (signup / login)  
3. Profile (list user’s rides & reservations; CRUD actions)  
4. Rides list (all upcoming rides; passengers reserve a seat)  
5. About-us (project-team bios)

---

🎯 **Step-by-step tasks for Cursor**

**Step 1 – Repo & tooling**

1. Create a private monorepo (`/server` & `/client`) with PNPM workspaces.  
2. Add ESLint + Prettier configs (shared).  
3. Generate `.env.example` with placeholders for `NEON_DATABASE_URL`, session secret, etc.

**Step 2 – Neon Postgres setup**

1. Create a Neon project & branch through CLI.  
2. Write SQL DDL (or Prisma schema) for tables:

   - `users` (id PK, name, email UNIQUE, password_hash, created_at)  
   - `rides` (id PK, driver_id FK→users, departure_time TIMESTAMPTZ, origin, destination, seats_total, seats_available, created_at)  
   - `reservations` (id PK, ride_id FK→rides, passenger_id FK→users, reserved_at)

3. Add migration script & seed two demo users.

**Step 3 – Express API**

1. Boot an Express app with helmet, morgan, CORS (frontend origin), cookie-session middleware.  
2. Implement routes:

   - `POST /auth/signup` → create user (hash with bcrypt 10 rounds).  
   - `POST /auth/login` → verify & set session cookie.  
   - `GET  /me` → return current user (auth guard).  
   - CRUD `/rides` (POST, GET upcoming, PATCH, DELETE) with ownership checks.  
   - `POST /rides/:id/reservations` and `DELETE /reservations/:id`.

3. Unit-test routes with Vitest + supertest.

**Step 4 – Vue front end**

1. Scaffold Vite + Vue 3 + Pinia + Vue Router.  
2. Global API service (axios default base URL).  
3. Pages/components:

   - `AuthUser.vue` (login/signup toggle, form validation).  
   - `ProfileUser.vue` (two tabs: My rides & My reservations; buttons to add/edit/delete).  
   - `ListRides.vue` (table/cards of upcoming rides, “Reserve” button).  
   - `AddRide.vue` (dialog or route with controlled form).  
   - `AboutUs.vue` (team bios w/ avatars).  

4. Protect routes with navigation guards using `/me`.

**Step 5 – State & UX polish**

1. Loading spinners, toasts (Vue-Toastification), & form-error displays.  
2. Date/time pickers (e.g. vue-datepicker) with locale `fr-FR`.  
3. Hide past rides client-side plus rely on API filter.

**Step 6 – Testing & CI**

1. Front-end component tests with Vitest + Vue Test Utils.  
2. Playwright e2e: signup, create ride, reserve seat.  
3. GitHub Actions workflow: lint → test → build → deploy preview.

**Step 7 – Deployment**

- **Server**: Render.com or Fly.io with Dockerfile (build → start).  
- **Client**: Vercel static build pointing to server API URL.  
- **DB**: Neon branch promoted to production.  
- Document environment variables & secrets in README.

**Step 8 – Extra credit ideas**

- JWT-based auth fallback for mobile.  
- Google OAuth.  
- Maps autocomplete (OpenStreetMap + Nominatim).  
- Real-time seat updates via Socket.io or Pusher.

**Step 9 – Presentation checklist**

- 5-min live demo covering all CRUD flows.  
- Slides: architecture diagram, DB schema, CI / CD, lessons learned.  
- Prepare for individual Q&A on code sections.

---

📝 **What to generate**

- Complete folder structure with placeholder files.  
- `package.json` scripts for dev / build / test / lint.  
- Migration & seed files.  
- Sample `.env`.  
- Readme explaining local setup & deployment.

👉 *Proceed step-by-step, committing after each numbered step. Document decisions inline as code comments where useful.*Projet_FramworksJS_2425.pdf