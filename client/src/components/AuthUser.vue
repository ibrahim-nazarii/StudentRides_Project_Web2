<template>
  <section class="auth-page">
    <div class="auth-card pop-in">

      <!-- Logo mark -->
      <div class="auth-logo">
        <svg width="28" height="28" viewBox="0 0 36 24" fill="none">
          <rect x="1" y="7" width="34" height="13" rx="3" fill="#3B8FC8"/>
          <path d="M5 7V5a4 4 0 014-4h18a4 4 0 014 4v2" stroke="#3B8FC8" stroke-width="2"/>
          <circle cx="9" cy="20" r="3" fill="#0B1628" stroke="#7dc0ec" stroke-width="1.5"/>
          <circle cx="27" cy="20" r="3" fill="#0B1628" stroke="#7dc0ec" stroke-width="1.5"/>
          <rect x="5" y="10" width="10" height="6" rx="1" fill="white" opacity="0.9"/>
          <rect x="18" y="10" width="13" height="6" rx="1" fill="white" opacity="0.9"/>
        </svg>
        <span>Student<strong>Rides</strong></span>
      </div>

      <h2 class="auth-title">{{ mode === "signup" ? i18n.t("auth.createAccount") : i18n.t("auth.welcomeBack") }}</h2>
      <p class="auth-sub">{{ mode === "signup" ? i18n.t("auth.signUpSub") : i18n.t("auth.signInSub") }}</p>

      <!-- Mode toggle -->
      <div class="mode-toggle">
        <button type="button" :class="['toggle-btn', mode === 'login' && 'toggle-btn--active']" @click="mode = 'login'">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          {{ i18n.t("auth.login") }}
        </button>
        <button type="button" :class="['toggle-btn', mode === 'signup' && 'toggle-btn--active']" @click="mode = 'signup'">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
          {{ i18n.t("auth.signup") }}
        </button>
      </div>

      <form @submit.prevent="submit" class="auth-form">

        <div v-if="mode === 'signup'" class="field">
          <label class="label" for="auth-name">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            {{ i18n.t("auth.name") }}
          </label>
          <input id="auth-name" v-model.trim="name" class="input" type="text" :placeholder="i18n.t('auth.namePlaceholder')" autocomplete="name" />
        </div>

        <div class="field">
          <label class="label" for="auth-email">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 8l10 6 10-6"/></svg>
            {{ i18n.t("auth.email") }}
          </label>
          <input id="auth-email" v-model.trim="email" class="input" type="email" :placeholder="i18n.t('auth.emailPlaceholder')" required autocomplete="email" />
        </div>

        <div class="field">
          <label class="label" for="auth-password">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            {{ i18n.t("auth.password") }}
          </label>
          <input id="auth-password" v-model="password" class="input" type="password" :placeholder="i18n.t('auth.passwordPlaceholder')" required minlength="6" autocomplete="current-password" />
        </div>

        <button type="submit" class="btn btn--submit" :disabled="submitting">
          <svg v-if="!submitting" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          {{ submitting ? i18n.t("auth.loading") : mode === "signup" ? i18n.t("auth.submitSignup") : i18n.t("auth.submit") }}
        </button>

        <div v-if="error" class="alert alert--danger pop-in" role="alert">{{ error }}</div>
      </form>

    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import { useAuthStore } from "../stores/auth";
import { useI18nStore } from "../stores/i18n";

const i18n = useI18nStore();

const router = useRouter();
const auth = useAuthStore();

const mode = ref("login");
const name = ref("");
const email = ref("");
const password = ref("");
const submitting = ref(false);
const error = ref(null);

const canSubmit = computed(() => {
  if (mode.value === "signup" && name.value.length < 2) return false;
  if (!email.value.includes("@")) return false;
  if (password.value.length < 6) return false;
  return true;
});

async function submit() {
  error.value = null;
  if (!canSubmit.value) { error.value = "Please fill all fields correctly."; return; }
  submitting.value = true;
  try {
    const payload = mode.value === "signup"
      ? { name: name.value, email: email.value, password: password.value }
      : { email: email.value, password: password.value };
    const res = await api.post(mode.value === "signup" ? "/auth/signup" : "/auth/login", payload);
    auth.setUser(res.data.user);
    router.push("/profile");
  } catch (e) {
    error.value = e?.response?.data?.error || "Authentication failed.";
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 68px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.auth-card {
  width: 100%;
  max-width: 440px;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-xl);
  padding: 2.25rem 2rem;
  box-shadow: var(--shadow-lg);
}

.auth-logo {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 1rem;
  color: var(--c-text);
  margin-bottom: 1.5rem;
}
.auth-logo strong { color: var(--c-primary); font-weight: 800; }

.auth-title {
  font-size: 1.4rem;
  font-weight: 800;
  margin-bottom: 0.35rem;
}
.auth-sub { font-size: 0.875rem; color: var(--c-text-muted); margin: 0 0 1.5rem; }

/* Mode toggle */
.mode-toggle {
  display: flex;
  background: var(--c-surface-2);
  border-radius: var(--r-md);
  padding: 4px;
  gap: 4px;
  margin-bottom: 1.5rem;
}
.toggle-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.5rem;
  border: none;
  border-radius: calc(var(--r-md) - 2px);
  background: transparent;
  color: var(--c-text-muted);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 140ms ease, color 140ms ease;
}
.toggle-btn--active {
  background: var(--c-surface-3);
  color: var(--c-text);
}
.toggle-btn:hover:not(.toggle-btn--active) { color: var(--c-text); }

/* Form */
.auth-form { display: grid; gap: 1rem; }

.label {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--c-text-muted);
}

.btn--submit {
  margin-top: 0.25rem;
  width: 100%;
  padding: 0.7rem;
  font-size: 0.925rem;
  border-radius: var(--r-md);
}
</style>
