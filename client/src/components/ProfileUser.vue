<template>
  <section class="page">
    <!-- Profile header -->
    <div class="profile-header">
      <div class="profile-avatar">{{ initials }}</div>
      <div class="profile-info">
        <h2 class="profile-name">{{ auth.user?.name || "My profile" }}</h2>
        <p class="profile-email">{{ auth.user?.email }}</p>
      </div>
    </div>

    <!-- Tab bar -->
    <div class="tab-bar">
      <button
        type="button"
        :class="['tab', tab === 'rides' && 'tab--active']"
        @click="tab = 'rides'"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        >
          <rect x="1" y="9" width="22" height="10" rx="2" />
          <path d="M5 9V6a3 3 0 013-3h8a3 3 0 013 3v3" />
          <circle cx="7" cy="19" r="2" />
          <circle cx="17" cy="19" r="2" />
        </svg>
        {{ i18n.t("profile.myRides") }}
        <span v-if="myRides.length" class="tab-count">{{ myRides.length }}</span>
      </button>
      <button
        type="button"
        :class="['tab', tab === 'reservations' && 'tab--active']"
        @click="tab = 'reservations'"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
        {{ i18n.t("profile.myReservations") }}
        <span v-if="myReservations.length" class="tab-count">{{ myReservations.length }}</span>
      </button>
    </div>

    <div v-if="loading" class="loading-row">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
        class="spin"
      >
        <path d="M21 12a9 9 0 11-9-9" />
      </svg>
      {{ i18n.t("rides.loading") }}
    </div>

    <div v-if="error" class="alert alert--danger pop-in" style="margin-bottom: 1rem" role="alert">
      {{ error }}
    </div>

    <!-- ══ MY RIDES ══ -->
    <div v-if="!loading && tab === 'rides'">
      <button type="button" class="btn" style="margin-bottom: 1.25rem" @click="startAdd">
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        {{ i18n.t("profile.postRide") }}
      </button>

      <AddRide
        v-if="adding || editingRide"
        :initialRide="editingRide"
        :showCancel="true"
        @saved="handleSaved"
        @cancel="handleCancelForm"
      />

      <div v-if="myRides.length === 0 && !adding" class="empty-state">
        <svg
          class="empty-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.3"
          stroke-linecap="round"
        >
          <rect x="1" y="9" width="22" height="10" rx="2" />
          <path d="M5 9V6a3 3 0 013-3h8a3 3 0 013 3v3" />
          <circle cx="7" cy="19" r="2" />
          <circle cx="17" cy="19" r="2" />
        </svg>
        <p class="empty-title">{{ i18n.t("profile.noRides.title") }}</p>
        <p class="empty-sub">{{ i18n.t("profile.noRides.sub") }}</p>
      </div>

      <div class="cards-list">
        <article v-for="ride in myRides" :key="ride.id" class="ride-card">
          <div class="ride-route">
            <span class="route-point">
              <svg width="9" height="9" viewBox="0 0 10 10">
                <circle cx="5" cy="5" r="4" fill="#3B8FC8" />
              </svg>
              {{ ride.origin }}
            </span>
            <svg
              width="18"
              height="7"
              viewBox="0 0 20 8"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              class="route-arrow"
            >
              <line x1="0" y1="4" x2="16" y2="4" />
              <polyline points="12,1 16,4 12,7" />
            </svg>
            <span class="route-point">
              <svg width="9" height="9" viewBox="0 0 10 10">
                <rect x="1" y="1" width="8" height="8" rx="1.5" fill="#2DD4A0" />
              </svg>
              {{ ride.destination }}
            </span>
          </div>

          <div class="ride-meta">
            <span class="meta-item">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {{ formatDate(ride.departure_time) }}
            </span>
            <span class="meta-item"
              >{{ VEHICLE_ICONS[ride.vehicle_type] || "🚗" }} {{ i18n.tVehicle(ride.vehicle_type || "Car") }}</span
            >
            <span class="meta-item" :class="{ 'meta-item--danger': ride.seats_available === 0 }">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              >
                <path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
              {{ ride.seats_available }}/{{ ride.seats_total }} seats
            </span>
          </div>

          <div class="card-actions">
            <button type="button" class="btn btn--ghost btn--sm" @click="startEdit(ride)">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.3"
                stroke-linecap="round"
              >
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              {{ i18n.t("profile.edit") }}
            </button>
            <button type="button" class="btn btn--danger btn--sm" @click="deleteRide(ride.id)">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.3"
                stroke-linecap="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M9 6V4h6v2" />
              </svg>
              {{ i18n.t("profile.delete") }}
            </button>
          </div>
        </article>
      </div>
    </div>

    <!-- ══ MY RESERVATIONS ══ -->
    <div v-if="!loading && tab === 'reservations'">
      <div v-if="myReservations.length === 0" class="empty-state">
        <svg
          class="empty-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.3"
          stroke-linecap="round"
        >
          <path d="M20 6L9 17l-5-5" />
          <rect x="3" y="3" width="18" height="18" rx="2" />
        </svg>
        <p class="empty-title">{{ i18n.t("profile.noReservations.title") }}</p>
        <p class="empty-sub">
          {{ i18n.t("profile.noReservations.sub") }}
        </p>
      </div>

      <div class="cards-list">
        <article v-for="r in myReservations" :key="r.reservation_id" class="ride-card">
          <div class="ride-route">
            <span class="route-point">
              <svg width="9" height="9" viewBox="0 0 10 10">
                <circle cx="5" cy="5" r="4" fill="#3B8FC8" />
              </svg>
              {{ r.origin }}
            </span>
            <svg
              width="18"
              height="7"
              viewBox="0 0 20 8"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              class="route-arrow"
            >
              <line x1="0" y1="4" x2="16" y2="4" />
              <polyline points="12,1 16,4 12,7" />
            </svg>
            <span class="route-point">
              <svg width="9" height="9" viewBox="0 0 10 10">
                <rect x="1" y="1" width="8" height="8" rx="1.5" fill="#2DD4A0" />
              </svg>
              {{ r.destination }}
            </span>
          </div>

          <div class="ride-meta">
            <span class="meta-item">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
              {{ r.driver_name }}
            </span>
            <span class="meta-item"
              >{{ VEHICLE_ICONS[r.vehicle_type] || "🚗" }} {{ i18n.tVehicle(r.vehicle_type || "Car") }}</span
            >
            <span class="meta-item">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {{ formatDate(r.departure_time) }}
            </span>
          </div>

          <div class="card-actions">
            <span class="badge badge--success">
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              {{ i18n.t("profile.confirmed") }}
            </span>
            <button
              type="button"
              class="btn btn--danger btn--sm"
              @click="cancelReservation(r.reservation_id)"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.3"
                stroke-linecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              {{ i18n.t("profile.cancel") }}
            </button>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import api from "../services/api";
import { useAuthStore } from "../stores/auth";
import { useI18nStore } from "../stores/i18n";
import AddRide from "./AddRide.vue";

const i18n = useI18nStore();

const auth = useAuthStore();

const VEHICLE_ICONS = {
  Car: "🚗",
  "Electric Car": "⚡",
  Van: "🚐",
  Motorcycle: "🏍️",
  Scooter: "🛵",
};

const initials = computed(() => {
  const name = auth.user?.name || "";
  return (
    name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?"
  );
});

const tab = ref("rides");
const loading = ref(false);
const error = ref(null);

const myRides = ref([]);
const myReservations = ref([]);
const adding = ref(false);
const editingRide = ref(null);

async function load() {
  loading.value = true;
  error.value = null;
  try {
    const [ridesRes, reservationsRes] = await Promise.all([
      api.get("/rides?mine=1"),
      api.get("/reservations/mine"),
    ]);
    myRides.value = ridesRes.data.rides || [];
    myReservations.value = reservationsRes.data.reservations || [];
  } catch (e) {
    error.value = e?.response?.data?.error || "Failed to load profile data.";
  } finally {
    loading.value = false;
  }
}

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(i18n.intlLocale, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function startAdd() {
  adding.value = true;
  editingRide.value = null;
}
function startEdit(r) {
  editingRide.value = r;
  adding.value = false;
}
function handleCancelForm() {
  adding.value = false;
  editingRide.value = null;
}
async function handleSaved() {
  adding.value = false;
  editingRide.value = null;
  await load();
}

async function deleteRide(id) {
  if (!window.confirm(i18n.t("profile.deleteConfirm"))) return;
  try {
    await api.delete(`/rides/${id}`);
    await load();
  } catch (e) {
    error.value = e?.response?.data?.error || "Delete failed.";
  }
}

async function cancelReservation(id) {
  if (!window.confirm(i18n.t("profile.cancelConfirm"))) return;
  try {
    await api.delete(`/reservations/${id}`);
    await load();
  } catch (e) {
    error.value = e?.response?.data?.error || "Cancel failed.";
  }
}

onMounted(load);
</script>

<style scoped>
/* Profile header */
.profile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.75rem;
  padding: 1.25rem 1.5rem;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-lg);
}
.profile-avatar {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: var(--c-primary-glow);
  border: 2px solid var(--c-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--c-primary);
  flex-shrink: 0;
}
.profile-name {
  font-size: 1.15rem;
  font-weight: 800;
  margin-bottom: 0.2rem;
}
.profile-email {
  font-size: 0.8rem;
  color: var(--c-text-muted);
  margin: 0;
}

/* Tabs */
.tab-bar {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--c-border);
  padding-bottom: 0;
}
.tab {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.65rem 1rem;
  border: none;
  background: transparent;
  color: var(--c-text-muted);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 2.5px solid transparent;
  margin-bottom: -1px;
  border-radius: var(--r-sm) var(--r-sm) 0 0;
  transition:
    color 140ms ease,
    border-color 140ms ease;
}
.tab:hover {
  color: var(--c-text);
}
.tab--active {
  color: var(--c-primary);
  border-bottom-color: var(--c-primary);
}
.tab-count {
  background: var(--c-surface-3);
  color: var(--c-text-muted);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.1rem 0.45rem;
  border-radius: var(--r-pill);
}
.tab--active .tab-count {
  background: var(--c-primary-glow);
  color: var(--c-primary);
}

/* Loading */
.loading-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--c-text-muted);
  font-size: 0.875rem;
  padding: 1rem 0;
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3.5rem 1rem;
  gap: 0.4rem;
  text-align: center;
}
.empty-icon {
  width: 52px;
  height: 52px;
  color: var(--c-text-faint);
  margin-bottom: 0.4rem;
}
.empty-title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}
.empty-sub {
  font-size: 0.85rem;
  color: var(--c-text-muted);
  margin: 0;
}

/* Cards */
.cards-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ride-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-lg);
  padding: 1rem 1.25rem;
  transition: border-color 160ms ease;
}
.ride-card:hover {
  border-color: rgba(59 143 200 / 0.3);
}

.ride-route {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.65rem;
}
.route-point {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--c-text);
}
.route-arrow {
  color: var(--c-route-arrow);
}

.ride-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 1.1rem;
  margin-bottom: 0.85rem;
}
.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.78rem;
  color: var(--c-meta-item);
}
.meta-item--danger {
  color: var(--c-danger);
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  border-top: 1px solid var(--c-border);
  padding-top: 0.75rem;
}

/* Spin animation */
.spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
