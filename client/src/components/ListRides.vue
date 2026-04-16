<template>
  <section class="page">

    <!-- Page header -->
    <div class="page-header">
      <div class="page-header-left">
        <div class="page-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="1" y="9" width="22" height="10" rx="2"/><path d="M5 9V6a3 3 0 013-3h8a3 3 0 013 3v3"/>
            <circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/>
          </svg>
        </div>
        <div>
          <h2 class="page-title">{{ i18n.t("rides.title") }}</h2>
          <p class="page-sub">{{ rides.length }} {{ i18n.t("rides.available").split("|")[rides.length !== 1 ? 1 : 0].trim() }}</p>
        </div>
      </div>
      <button type="button" class="btn btn--ghost btn--sm" :disabled="loading" @click="loadRides">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round">
          <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
          <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
        </svg>
        {{ loading ? i18n.t("rides.loading") : i18n.t("rides.refresh") }}
      </button>
    </div>

    <div v-if="error" class="alert alert--danger pop-in" style="margin-bottom:1rem">{{ error }}</div>

    <!-- Empty state -->
    <div v-if="!loading && rides.length === 0" class="empty-state">
      <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round">
        <rect x="1" y="9" width="22" height="10" rx="2"/><path d="M5 9V6a3 3 0 013-3h8a3 3 0 013 3v3"/>
        <circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/>
      </svg>
      <p class="empty-title">{{ i18n.t("rides.empty.title") }}</p>
      <p class="empty-sub">{{ i18n.t("rides.empty.sub") }}</p>
    </div>

    <!-- Ride cards -->
    <div class="rides-list">
      <article
        v-for="ride in rides"
        :key="ride.id"
        class="ride-card pop-in"
      >
        <!-- Route -->
        <div class="ride-route">
          <span class="route-point route-point--origin">
            <svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="currentColor" opacity="0.9"/></svg>
            {{ ride.origin }}
          </span>
          <span class="route-arrow">
            <svg width="20" height="8" viewBox="0 0 20 8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
              <line x1="0" y1="4" x2="16" y2="4"/><polyline points="12,1 16,4 12,7"/>
            </svg>
          </span>
          <span class="route-point route-point--dest">
            <svg width="10" height="10" viewBox="0 0 10 10"><rect x="1" y="1" width="8" height="8" rx="1.5" fill="currentColor" opacity="0.9"/></svg>
            {{ ride.destination }}
          </span>
        </div>

        <!-- Meta row -->
        <div class="ride-meta">
          <span class="meta-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {{ formatDate(ride.departure_time) }}
          </span>
          <span class="meta-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            {{ ride.driver_name }}
          </span>
          <span class="meta-item">
            <span class="vehicle-emoji">{{ vehicleIcon(ride.vehicle_type) }}</span>
            {{ i18n.tVehicle(ride.vehicle_type) }}
          </span>
          <span class="meta-item" :class="{ 'meta-item--danger': ride.seats_available === 0 }">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
            {{ ride.seats_available }}/{{ ride.seats_total }} seats
          </span>
        </div>

        <!-- Actions -->
        <div class="ride-actions">
          <!-- Own ride -->
          <template v-if="isOwnRide(ride)">
            <span class="badge badge--primary">{{ i18n.t("rides.yourRide") }}</span>
            <button type="button" class="btn btn--danger btn--sm" :disabled="deletingId === ride.id" @click="deleteRide(ride.id)">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
              {{ deletingId === ride.id ? i18n.t("rides.deleting") : i18n.t("rides.delete") }}
            </button>
          </template>

          <!-- Already reserved -->
          <button v-else-if="hasReserved(ride)" type="button" class="btn btn--danger btn--sm" :disabled="cancellingId === ride.id" @click="cancelReservation(ride.id)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            {{ cancellingId === ride.id ? i18n.t("rides.cancelling") : i18n.t("rides.cancelReservation") }}
          </button>

          <!-- Full -->
          <span v-else-if="ride.seats_available <= 0" class="badge badge--danger">{{ i18n.t("rides.full") }}</span>

          <!-- Reserve -->
          <button v-else type="button" class="btn btn--sm" :disabled="reservingId === ride.id" @click="reserve(ride.id)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>
            {{ reservingId === ride.id ? i18n.t("rides.reserving") : i18n.t("rides.reserve") }}
          </button>

          <div v-if="reserveErrorFor(ride.id)" class="action-error">{{ reserveErrorFor(ride.id) }}</div>
        </div>
      </article>
    </div>

  </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import api from "../services/api";
import { useAuthStore } from "../stores/auth";
import { useI18nStore } from "../stores/i18n";

const auth = useAuthStore();
const i18n = useI18nStore();

const VEHICLE_ICONS = { "Car":"🚗","Electric Car":"⚡","Van":"🚐","Motorcycle":"🏍️","Scooter":"🛵" };
function vehicleIcon(t) { return VEHICLE_ICONS[t] || "🚗"; }

const loading = ref(false);
const error = ref(null);
const rides = ref([]);
const myReservations = ref(new Map());

const reservingId  = ref(null);
const cancellingId = ref(null);
const deletingId   = ref(null);
const reserveErrors = ref({});

let pollInterval = null;

async function loadRides() {
  loading.value = true;
  error.value = null;
  try {
    const [ridesRes, reservationsRes] = await Promise.all([
      api.get("/rides"),
      api.get("/reservations/mine")
    ]);
    rides.value = ridesRes.data.rides || [];
    myReservations.value = new Map(
      (reservationsRes.data.reservations || []).map((r) => [r.ride_id, r.reservation_id])
    );
  } catch (e) {
    error.value = e?.response?.data?.error || "Failed to load rides.";
  } finally {
    loading.value = false;
  }
}

function isOwnRide(ride) { return auth.user && ride.driver_id === auth.user.id; }
function hasReserved(ride) { return myReservations.value.has(ride.id); }
function reserveErrorFor(id) { return reserveErrors.value[id] || null; }

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(i18n.intlLocale, { weekday:"short", day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit" });
}

async function reserve(rideId) {
  reservingId.value = rideId;
  reserveErrors.value = { ...reserveErrors.value, [rideId]: null };
  try {
    await api.post(`/rides/${rideId}/reservations`);
    await loadRides();
  } catch (e) {
    reserveErrors.value = { ...reserveErrors.value, [rideId]: e?.response?.data?.error || "Reserve failed." };
  } finally { reservingId.value = null; }
}

async function deleteRide(rideId) {
  if (!window.confirm(i18n.t("rides.deleteConfirm"))) return;
  deletingId.value = rideId;
  try {
    await api.delete(`/rides/${rideId}`);
    await loadRides();
  } catch (e) {
    reserveErrors.value = { ...reserveErrors.value, [rideId]: e?.response?.data?.error || "Delete failed." };
  } finally { deletingId.value = null; }
}

async function cancelReservation(rideId) {
  const reservationId = myReservations.value.get(rideId);
  if (!reservationId) return;
  cancellingId.value = rideId;
  try {
    await api.delete(`/reservations/${reservationId}`);
    await loadRides();
  } catch (e) {
    reserveErrors.value = { ...reserveErrors.value, [rideId]: e?.response?.data?.error || "Cancellation failed." };
  } finally { cancellingId.value = null; }
}

onMounted(() => { loadRides(); pollInterval = setInterval(loadRides, 30_000); });
onUnmounted(() => { clearInterval(pollInterval); });
</script>

<style scoped>
/* Page header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.page-header-left { display: flex; align-items: center; gap: 0.85rem; }
.page-icon {
  width: 42px; height: 42px;
  border-radius: var(--r-md);
  background: var(--c-primary-glow);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.page-icon svg { width: 22px; height: 22px; color: var(--c-primary); }
.page-title { font-size: 1.35rem; font-weight: 800; margin-bottom: 0.1rem; }
.page-sub   { font-size: 0.8rem; color: var(--c-text-muted); margin: 0; }

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 1rem;
  gap: 0.5rem;
  text-align: center;
}
.empty-icon { width: 56px; height: 56px; color: var(--c-text-faint); margin-bottom: 0.5rem; }
.empty-title { font-size: 1.05rem; font-weight: 700; color: var(--c-text); margin: 0; }
.empty-sub   { font-size: 0.875rem; color: var(--c-text-muted); margin: 0; }

/* Ride list */
.rides-list { display: flex; flex-direction: column; gap: 0.85rem; }

.ride-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-lg);
  padding: 1.1rem 1.25rem;
  box-shadow: var(--shadow-sm);
  transition: border-color 160ms ease, box-shadow 160ms ease;
}
.ride-card:hover {
  border-color: rgba(59 143 200 / 0.3);
  box-shadow: var(--shadow-md);
}

/* Route */
.ride-route {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.85rem;
  flex-wrap: wrap;
}
.route-point {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--c-text);
}
.route-point--origin svg { color: var(--c-primary); }
.route-point--dest   svg { color: var(--c-success); }
.route-arrow { color: var(--c-route-arrow); display: flex; }

/* Meta */
.ride-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
  margin-bottom: 1rem;
}
.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: var(--c-meta-item);
}
.meta-item svg { flex-shrink: 0; }
.meta-item--danger { color: var(--c-danger); }
.vehicle-emoji { font-size: 1rem; line-height: 1; }

/* Actions */
.ride-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  border-top: 1px solid var(--c-border);
  padding-top: 0.85rem;
}
.action-error {
  font-size: 0.78rem;
  color: var(--c-danger);
  flex: 1;
  min-width: 0;
  overflow-wrap: break-word;
}
</style>
