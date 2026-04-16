<template>
  <main class="page">

    <!-- Hero -->
    <section class="hero pop-in">
      <div class="hero-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
        {{ i18n.t("home.badge") }}
      </div>
      <h1 class="hero-title" style="white-space:pre-line">{{ i18n.t("home.title") }}</h1>
      <p class="hero-subtitle">{{ i18n.t("home.subtitle") }}</p>

      <div class="hero-actions">
        <RouterLink class="btn btn--pill" to="/rides">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="1" y="9" width="22" height="10" rx="2"/><path d="M5 9V6a3 3 0 013-3h8a3 3 0 013 3v3"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/></svg>
          {{ i18n.t("home.browseRides") }}
        </RouterLink>
        <RouterLink v-if="!auth.user" class="btn btn--pill btn--outline-white" to="/auth">
          {{ i18n.t("home.getStarted") }}
        </RouterLink>
      </div>

      <svg class="hero-wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,40L60,37.3C120,35,240,29,360,32C480,35,600,45,720,48C840,51,960,45,1080,40C1200,35,1320,29,1380,26.7L1440,24L1440,80L0,80Z" fill="#0B1628"/>
      </svg>
    </section>

    <!-- Features -->
    <div class="features">
      <RouterLink v-for="f in features" :key="f.key" :to="f.to" class="feature-card">
        <div class="feature-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" v-html="f.icon" />
        </div>
        <h3 class="feature-title">{{ i18n.t(`home.features.${f.key}.title`) }}</h3>
        <p class="feature-desc">{{ i18n.t(`home.features.${f.key}.desc`) }}</p>
        <span class="feature-cta">
          {{ i18n.locale === "fr" ? "En savoir plus" : "Learn more" }}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </span>
      </RouterLink>
    </div>

    <!-- CTA -->
    <div v-if="!auth.user" class="cta-banner fade-up">
      <div>
        <div class="cta-title">{{ i18n.t("home.cta.title") }}</div>
        <div class="cta-sub">{{ i18n.t("home.cta.sub") }}</div>
      </div>
      <RouterLink to="/auth" class="btn btn--pill">{{ i18n.t("home.cta.btn") }}</RouterLink>
    </div>

  </main>
</template>

<script setup>
import { RouterLink } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useI18nStore } from "../stores/i18n";

const auth = useAuthStore();
const i18n = useI18nStore();

const features = [
  { key: "browse", to: "/rides",   icon: `<rect x="1" y="9" width="22" height="10" rx="2"/><path d="M5 9V6a3 3 0 013-3h8a3 3 0 013 3v3"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/>` },
  { key: "share",  to: "/profile", icon: `<path d="M12 5v14M5 12l7 7 7-7"/>` },
  { key: "book",   to: "/rides",   icon: `<path d="M20 6L9 17l-5-5"/>` }
];
</script>

<style scoped>
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.8rem;
  border-radius: var(--r-pill);
  background: rgba(59 143 200 / 0.18);
  border: 1px solid rgba(59 143 200 / 0.35);
  color: #7dc0ec;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 1.25rem;
}

.hero-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 1.75rem;
}

.btn--outline-white {
  background: transparent;
  border: 1.5px solid rgba(255 255 255 / 0.6);
  color: #fff;
}
.btn--outline-white:hover { background: rgba(255 255 255 / 0.1); filter: none; }

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.feature-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-lg);
  padding: 1.5rem 1.25rem;
  transition: border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}
.feature-card:hover {
  border-color: rgba(59 143 200 / 0.45);
  box-shadow: 0 0 28px rgba(59 143 200 / 0.12);
  transform: translateY(-2px);
  text-decoration: none;
}

.feature-icon {
  width: 42px; height: 42px;
  border-radius: var(--r-md);
  background: var(--c-primary-glow);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 1rem;
}
.feature-icon svg { width: 22px; height: 22px; color: var(--c-primary); }

.feature-title { font-size: 1rem; font-weight: 700; margin-bottom: 0.4rem; color: var(--c-text); }

.feature-desc {
  font-size: 0.875rem;
  color: var(--c-text-muted);
  line-height: 1.6;
  margin: 0 0 1rem;
  flex: 1;
}

.feature-cta {
  display: inline-flex; align-items: center; gap: 0.35rem;
  font-size: 0.8rem; font-weight: 700; color: var(--c-primary);
  opacity: 0; transition: opacity 180ms ease;
}
.feature-card:hover .feature-cta { opacity: 1; }

.cta-banner {
  display: flex; align-items: center; justify-content: space-between;
  gap: 1rem; flex-wrap: wrap; margin-top: 2rem;
  background: linear-gradient(135deg, #132d50 0%, #1a3d6e 100%);
  border: 1px solid rgba(59 143 200 / 0.25);
  border-radius: var(--r-lg);
  padding: 1.5rem 1.75rem;
}
.cta-title { font-size: 1.1rem; font-weight: 700; color: var(--c-text); margin-bottom: 0.25rem; }
.cta-sub   { font-size: 0.875rem; color: var(--c-text-muted); }
</style>
