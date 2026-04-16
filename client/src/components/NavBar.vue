<template>
  <header class="navbar">

    <!-- Brand -->
    <RouterLink to="/" class="brand" aria-label="Student Rides home">
      <span class="brand-icon" aria-hidden="true">
        <svg viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="7" width="34" height="13" rx="3" fill="#3B8FC8"/>
          <path d="M5 7V5a4 4 0 014-4h18a4 4 0 014 4v2" stroke="#3B8FC8" stroke-width="2"/>
          <circle cx="9" cy="20" r="3" fill="#0B1628" stroke="#fff" stroke-width="1.5"/>
          <circle cx="27" cy="20" r="3" fill="#0B1628" stroke="#fff" stroke-width="1.5"/>
          <rect x="5" y="10" width="10" height="6" rx="1" fill="white" opacity="0.9"/>
          <rect x="18" y="10" width="13" height="6" rx="1" fill="white" opacity="0.9"/>
        </svg>
      </span>
      <span class="brand-text">student<strong>rides</strong></span>
    </RouterLink>

    <!-- Center navigation -->
    <nav class="nav" aria-label="Main navigation">
      <RouterLink to="/" class="nav-item">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 12L12 3l9 9"/>
          <path d="M9 21V12h6v9"/>
          <path d="M4 12v9h16v-9"/>
        </svg>
        <span>{{ i18n.t("nav.home") }}</span>
      </RouterLink>

      <RouterLink v-if="auth.user" to="/rides" class="nav-item">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="1" y="9" width="22" height="10" rx="2"/>
          <path d="M5 9V6a3 3 0 013-3h8a3 3 0 013 3v3"/>
          <circle cx="7" cy="19" r="2"/>
          <circle cx="17" cy="19" r="2"/>
          <line x1="3" y1="14" x2="7" y2="14"/>
          <line x1="17" y1="14" x2="21" y2="14"/>
        </svg>
        <span>{{ i18n.t("nav.rides") }}</span>
      </RouterLink>

      <RouterLink v-if="auth.user" to="/profile" class="nav-item">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="8" r="4"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
        <span>{{ i18n.t("nav.profile") }}</span>
      </RouterLink>

      <RouterLink to="/about" class="nav-item">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="9"/>
          <line x1="12" y1="11" x2="12" y2="17"/>
          <circle cx="12" cy="8" r="0.5" fill="currentColor" stroke="none"/>
        </svg>
        <span>{{ i18n.t("nav.about") }}</span>
      </RouterLink>
    </nav>

    <!-- Right actions -->
    <div class="actions">
      <!-- Theme toggle -->
      <button type="button" class="theme-toggle" :title="theme.isDark ? 'Switch to light mode' : 'Switch to dark mode'" @click="theme.toggle()">
        <!-- Sun (shown in dark mode → click to go light) -->
        <svg v-if="theme.isDark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <!-- Moon (shown in light mode → click to go dark) -->
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/>
        </svg>
      </button>

      <!-- Language toggle -->
      <button type="button" class="lang-toggle" :title="i18n.locale === 'fr' ? 'Switch to English' : 'Passer en français'" @click="i18n.toggle()">
        {{ i18n.locale === "fr" ? "EN" : "FR" }}
      </button>

      <span v-if="auth.user" class="greeting">{{ firstName }}</span>
      <RouterLink v-if="!auth.user" to="/auth" class="btn-connect">
        {{ i18n.t("nav.login") }}
      </RouterLink>
      <button v-else type="button" class="btn-connect btn-connect--logout" @click="handleLogout">
        {{ i18n.t("nav.logout") }}
      </button>
    </div>

  </header>
</template>

<script setup>
import { computed } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useThemeStore } from "../stores/theme";
import { useI18nStore } from "../stores/i18n";

const auth = useAuthStore();
const theme = useThemeStore();
const i18n = useI18nStore();
const router = useRouter();

const firstName = computed(() => auth.user?.name?.split(" ")[0] || "");

async function handleLogout() {
  await auth.logout();
  router.push("/auth");
}
</script>

<style scoped>
/* ── Shell ─────────────────────────────────────────────── */
.navbar {
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0 1.75rem;
  background: #0B1628;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255 255 255 / 0.06);
}

/* ── Brand ─────────────────────────────────────────────── */
.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  flex-shrink: 0;
}
.brand:hover {
  text-decoration: none;
  opacity: 0.85;
}

.brand-icon {
  display: flex;
  align-items: center;
  width: 42px;
  height: 28px;
  flex-shrink: 0;
}
.brand-icon svg {
  width: 100%;
  height: 100%;
}

.brand-text {
  font-size: 0.95rem;
  color: #ffffff;
  letter-spacing: 0.01em;
  line-height: 1;
}
.brand-text strong {
  font-weight: 800;
  color: #3B8FC8;
}

/* ── Nav ───────────────────────────────────────────────── */
.nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex: 1;
  justify-content: center;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.55rem 1rem;
  border-radius: 0.5rem;
  color: rgba(255 255 255 / 0.65);
  text-decoration: none;
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  transition: color 160ms ease, background 160ms ease;
  position: relative;
}

.nav-item:hover {
  color: #ffffff;
  background: rgba(255 255 255 / 0.06);
  text-decoration: none;
}

/* Active indicator : bottom bar like SNCF */
.nav-item.router-link-active,
.nav-item.router-link-exact-active {
  color: #ffffff;
}
.nav-item.router-link-exact-active::after,
.nav-item.router-link-active:not([href="/"]):not(.router-link-exact-active)::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 20%;
  right: 20%;
  height: 2.5px;
  border-radius: 2px;
  background: #3B8FC8;
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* ── Right actions ─────────────────────────────────────── */
.actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.greeting {
  font-size: 0.82rem;
  color: rgba(255 255 255 / 0.55);
}

.lang-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  padding: 0 0.6rem;
  border-radius: var(--r-sm);
  border: 1.5px solid rgba(255 255 255 / 0.2);
  background: transparent;
  color: rgba(255 255 255 / 0.7);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: background 160ms ease, border-color 160ms ease, color 160ms ease;
  flex-shrink: 0;
}
.lang-toggle:hover {
  background: rgba(255 255 255 / 0.1);
  border-color: rgba(255 255 255 / 0.5);
  color: #ffffff;
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1.5px solid rgba(255 255 255 / 0.2);
  background: transparent;
  color: rgba(255 255 255 / 0.7);
  cursor: pointer;
  transition: background 160ms ease, border-color 160ms ease, color 160ms ease;
  flex-shrink: 0;
}
.theme-toggle:hover {
  background: rgba(255 255 255 / 0.1);
  border-color: rgba(255 255 255 / 0.5);
  color: #ffffff;
}

.btn-connect {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 1.25rem;
  border-radius: 999px;
  border: 1.5px solid rgba(255 255 255 / 0.75);
  background: transparent;
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: background 160ms ease, border-color 160ms ease;
  white-space: nowrap;
}
.btn-connect:hover {
  background: rgba(255 255 255 / 0.1);
  border-color: #ffffff;
  text-decoration: none;
  color: #ffffff;
}

.btn-connect--logout {
  border-color: rgba(255 255 255 / 0.35);
  color: rgba(255 255 255 / 0.7);
}
.btn-connect--logout:hover {
  border-color: #ff6b6b;
  color: #ff6b6b;
  background: rgba(255 107 107 / 0.08);
}
</style>
