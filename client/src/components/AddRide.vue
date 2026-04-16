<template>
  <form class="add-ride-form" @submit.prevent="submit">
    <div class="form-header">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      {{ initialRide ? i18n.t("addRide.titleEdit") : i18n.t("addRide.titleAdd") }}
    </div>

    <div class="form-grid">
      <!-- Departure time -->
      <div class="field">
        <label class="label" for="ar-time">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          {{ i18n.t("addRide.departureTime") }}
        </label>
        <input id="ar-time" v-model="departureTimeLocal" class="input" type="datetime-local" :min="minDateTime" required />
      </div>

      <!-- Origin -->
      <div class="field">
        <label class="label" for="ar-origin">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="11" r="3"/><path d="M12 2a9 9 0 00-9 9c0 5 9 13 9 13s9-8 9-13a9 9 0 00-9-9z"/></svg>
          {{ i18n.t("addRide.origin") }}
        </label>
        <input id="ar-origin" v-model.trim="origin" class="input" type="text" :placeholder="i18n.t('addRide.originPlaceholder')" required />
      </div>

      <!-- Destination -->
      <div class="field">
        <label class="label" for="ar-dest">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M3 12l9-9 9 9"/><path d="M9 21V12h6v9"/></svg>
          {{ i18n.t("addRide.destination") }}
        </label>
        <input id="ar-dest" v-model.trim="destination" class="input" type="text" :placeholder="i18n.t('addRide.destinationPlaceholder')" required />
      </div>

      <!-- Seats -->
      <div class="field">
        <label class="label" for="ar-seats">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
          {{ i18n.t("addRide.seats") }}
        </label>
        <input
          id="ar-seats"
          v-model.number="seatsTotal"
          class="input"
          type="number"
          :min="minSeats"
          :max="maxSeats"
          step="1"
          :disabled="minSeats === maxSeats"
          required
        />
        <span class="seats-hint">{{ minSeats === maxSeats ? maxSeats : `${minSeats} – ${maxSeats}` }}</span>
      </div>
    </div>

    <!-- Vehicle picker -->
    <div class="field" style="margin-top:0.25rem">
      <span class="label">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="1" y="9" width="22" height="10" rx="2"/><path d="M5 9V6a3 3 0 013-3h8a3 3 0 013 3v3"/></svg>
        {{ i18n.t("addRide.vehicleType") }}
      </span>
      <div class="vehicle-picker">
        <button
          v-for="vt in VEHICLE_TYPES"
          :key="vt.value"
          type="button"
          :class="['vehicle-btn', vehicleType === vt.value && 'vehicle-btn--active']"
          @click="vehicleType = vt.value"
        >
          <span class="vehicle-emoji">{{ vt.icon }}</span>
          <span class="vehicle-name">{{ i18n.tVehicle(vt.value) }}</span>
        </button>
      </div>
    </div>

    <!-- Form actions -->
    <div class="form-actions">
      <button type="submit" class="btn" :disabled="submitting">
        <svg v-if="!submitting" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>
        {{ submitting ? i18n.t("addRide.saving") : initialRide ? i18n.t("addRide.save") : i18n.t("addRide.publish") }}
      </button>
      <button v-if="showCancel" type="button" class="btn btn--ghost" :disabled="submitting" @click="emit('cancel')">
        {{ i18n.t("addRide.cancel") }}
      </button>
    </div>

    <div v-if="error" class="alert alert--danger pop-in" role="alert">{{ error }}</div>
  </form>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import api from "../services/api";
import { useI18nStore } from "../stores/i18n";

const i18n = useI18nStore();

const VEHICLE_TYPES = [
  { value: "Car",          icon: "🚗", min: 2, max: 4 },
  { value: "Electric Car", icon: "⚡", min: 2, max: 4 },
  { value: "Van",          icon: "🚐", min: 2, max: 8 },
  { value: "Motorcycle",   icon: "🏍️", min: 1, max: 1 },
  { value: "Scooter",      icon: "🛵", min: 1, max: 1 },
];

const vehicleConfig = computed(() => VEHICLE_TYPES.find(v => v.value === vehicleType.value) ?? VEHICLE_TYPES[0]);
const minSeats = computed(() => vehicleConfig.value.min);
const maxSeats = computed(() => vehicleConfig.value.max);

const props = defineProps({
  initialRide: { type: Object, default: null },
  showCancel:  { type: Boolean, default: true }
});
const emit = defineEmits(["saved", "cancel"]);

// datetime-local min must be in "YYYY-MM-DDTHH:mm" format (local time).
const minDateTime = computed(() => new Date(Date.now() - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 16));

const submitting = ref(false);
const error = ref(null);
const departureTimeLocal = ref("");
const origin = ref("");
const destination = ref("");
const vehicleType = ref("Car");
const seatsTotal = ref(2);

function toLocalInputValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 16);
}

function resetFromInitial() {
  if (!props.initialRide) {
    departureTimeLocal.value = "";
    origin.value = ""; destination.value = "";
    vehicleType.value = "Car"; seatsTotal.value = 2;
    return;
  }
  departureTimeLocal.value = toLocalInputValue(props.initialRide.departure_time);
  origin.value      = props.initialRide.origin || "";
  destination.value = props.initialRide.destination || "";
  vehicleType.value = props.initialRide.vehicle_type || "Car";
  seatsTotal.value  = Number(props.initialRide.seats_total || 2);
}

watch(() => props.initialRide, () => resetFromInitial(), { immediate: true });

// When the vehicle changes, clamp seats into the new valid range.
watch(vehicleConfig, (cfg) => {
  if (seatsTotal.value < cfg.min) seatsTotal.value = cfg.min;
  if (seatsTotal.value > cfg.max) seatsTotal.value = cfg.max;
});

const payload = computed(() => ({
  departure_time: departureTimeLocal.value ? new Date(departureTimeLocal.value).toISOString() : null,
  origin: origin.value,
  destination: destination.value,
  vehicle_type: vehicleType.value,
  seats_total: seatsTotal.value
}));

async function submit() {
  error.value = null;
  if (!payload.value.departure_time) { error.value = i18n.t("addRide.errorDate"); return; }
  if (seatsTotal.value > maxSeats.value) {
    error.value = i18n.tp("addRide.errorSeatsMax", { max: maxSeats.value });
    return;
  }
  if (seatsTotal.value < minSeats.value) {
    error.value = i18n.tp("addRide.errorSeatsMin", { min: minSeats.value });
    return;
  }
  submitting.value = true;
  try {
    if (props.initialRide) {
      await api.patch(`/rides/${props.initialRide.id}`, payload.value);
    } else {
      await api.post("/rides", payload.value);
    }
    emit("saved");
  } catch (e) {
    error.value = e?.response?.data?.error || "Save failed.";
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.add-ride-form {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-lg);
  padding: 1.5rem;
  margin-bottom: 1.25rem;
  box-shadow: var(--shadow-md);
}

.form-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--c-text);
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--c-border);
}
.form-header svg { color: var(--c-primary); }

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.9rem;
  margin-bottom: 0.9rem;
}

.label {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--c-text-muted);
}

/* Vehicle picker */
.seats-hint {
  display: block;
  margin-top: 0.3rem;
  font-size: 0.75rem;
  color: var(--c-text-muted);
}

.vehicle-picker {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.35rem;
}

.vehicle-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.6rem 0.85rem;
  min-width: 72px;
  border: 1.5px solid var(--c-border);
  border-radius: var(--r-md);
  background: var(--c-surface-2);
  cursor: pointer;
  transition: border-color 130ms ease, background 130ms ease;
  color: var(--c-text-muted);
}
.vehicle-btn:hover { border-color: rgba(59 143 200 / 0.5); color: var(--c-text); }
.vehicle-btn--active {
  border-color: var(--c-primary);
  background: var(--c-primary-glow);
  color: var(--c-primary);
}
.vehicle-emoji { font-size: 1.4rem; line-height: 1; }
.vehicle-name  { font-size: 0.72rem; font-weight: 600; white-space: nowrap; }

/* Actions */
.form-actions {
  display: flex;
  gap: 0.65rem;
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid var(--c-border);
  flex-wrap: wrap;
}
</style>
