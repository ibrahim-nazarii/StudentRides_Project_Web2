<template>
  <section class="page">
    <!-- Header -->
    <div class="about-header pop-in">
      <div class="about-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      </div>
      <div>
        <h2 class="about-title">{{ i18n.t("about.title") }}</h2>
        <p class="about-sub">{{ i18n.t("about.sub") }}</p>
      </div>
    </div>

    <!-- Mission strip -->
    <div class="mission-strip fade-up">
      <div v-for="(m, idx) in mission" :key="idx" class="mission-item">
        <span class="mission-icon">{{ m.icon }}</span>
        <span class="mission-label">{{ m.label }}</span>
      </div>
    </div>

    <!-- Team cards -->
    <h3 class="section-title">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
      {{ i18n.t("about.meetTeam") }}
    </h3>

    <div class="team-grid">
      <div v-for="p in people" :key="p.name" class="member-card fade-up">
        <img v-if="p.photo" :src="p.photo" :alt="p.name" class="member-photo" />
        <div v-else class="member-avatar" :style="{ '--hue': p.hue }">{{ p.initials }}</div>
        <div class="member-info">
          <div class="member-name">{{ p.name }}</div>
          <div class="member-role">
            <span class="role-badge">{{ p.role }}</span>
          </div>
          <p class="member-bio">{{ p.bio }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useI18nStore } from "../stores/i18n";

const i18n = useI18nStore();

const MISSION_ICONS = ["🚗", "💰", "🤝", "🔒"];
const mission = computed(() =>
  (i18n.messages.about?.mission || []).map((label, idx) => ({
    icon: MISSION_ICONS[idx],
    label,
  }))
);

const base = import.meta.env.BASE_URL;

const people = computed(() => [
  {
    name: "Eya LAHOUEL",
    initials: "EY",
    photo: `${base}images/Eya.png`,
    role: "Frontend",
    hue: 205,
    bio: i18n.t("about.bios.eya"),
  },
  {
    name: "Ibrahim NAZARI",
    initials: "IB",
    photo: `${base}images/Ibrahim.png`,
    role: "Full-stack",
    hue: 280,
    bio: i18n.t("about.bios.ibrahim"),
  },
  {
    name: "Rania KRAIEM",
    initials: "RA",
    photo: `${base}images/Rania.png`,
    role: "Backend",
    hue: 160,
    bio: i18n.t("about.bios.rania"),
  },
]);
</script>

<style scoped>
/* Header */
.about-header {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
  margin-bottom: 2rem;
}
.about-icon {
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  border-radius: var(--r-md);
  background: var(--c-primary-glow);
  display: flex;
  align-items: center;
  justify-content: center;
}
.about-icon svg {
  width: 26px;
  height: 26px;
  color: var(--c-primary);
}
.about-title {
  font-size: 1.6rem;
  font-weight: 800;
  margin-bottom: 0.4rem;
}
.about-sub {
  color: var(--c-text-muted);
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
  max-width: 600px;
}

/* Mission strip */
.mission-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
}
.mission-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1rem;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-pill);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--c-text-muted);
}
.mission-icon {
  font-size: 1.1rem;
}

/* Section title */
.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--c-text-muted);
  margin-bottom: 1rem;
  letter-spacing: 0.03em;
}
.section-title svg {
  color: var(--c-primary);
}

/* Team */
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.member-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-lg);
  padding: 1.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease;
}
.member-card:hover {
  border-color: rgba(59 143 200 / 0.35);
  box-shadow: 0 0 24px rgba(59 143 200 / 0.1);
}

.member-photo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2.5px solid var(--c-primary);
  box-shadow: 0 0 0 4px var(--c-primary-glow);
}

.member-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: hsl(var(--hue) 55% 18%);
  border: 2.5px solid hsl(var(--hue) 55% 50%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 800;
  color: hsl(var(--hue) 80% 75%);
}
:global([data-theme="light"]) .member-avatar {
  background: hsl(var(--hue) 55% 88%);
  border-color: hsl(var(--hue) 55% 45%);
  color: hsl(var(--hue) 60% 30%);
}

.member-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--c-text);
}
.role-badge {
  display: inline-block;
  padding: 0.2rem 0.65rem;
  border-radius: var(--r-pill);
  background: var(--c-primary-glow);
  color: var(--c-primary);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.member-bio {
  font-size: 0.83rem;
  color: var(--c-text-muted);
  line-height: 1.6;
  margin: 0;
}
</style>
