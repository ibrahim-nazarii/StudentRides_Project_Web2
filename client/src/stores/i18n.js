import { defineStore } from "pinia";
import { computed, ref } from "vue";
import en from "../locales/en.js";
import fr from "../locales/fr.js";

const LOCALES = { en, fr };
const STORAGE_KEY = "sr-locale";

export const useI18nStore = defineStore("i18n", () => {
  const locale = ref(localStorage.getItem(STORAGE_KEY) || "fr");

  const messages = computed(() => LOCALES[locale.value] || LOCALES.fr);

  function setLocale(lang) {
    locale.value = lang;
    localStorage.setItem(STORAGE_KEY, lang);
  }

  function toggle() {
    setLocale(locale.value === "fr" ? "en" : "fr");
  }

  /**
   * Resolve a dot-notation key against the current messages object.
   * e.g. t("nav.home") → "Accueil"
   */
  function t(key) {
    return key.split(".").reduce((obj, k) => obj?.[k], messages.value) ?? key;
  }

  /**
   * Translate with simple {placeholder} substitution.
   * e.g. tp("addRide.errorSeatsMax", { max: 4 }) → "Max 4 passengers."
   */
  function tp(key, params = {}) {
    return Object.entries(params).reduce(
      (str, [k, v]) => str.replaceAll(`{${k}}`, v),
      t(key)
    );
  }

  /**
   * Translate a vehicle type name stored in English in the DB.
   * e.g. tVehicle("Electric Car") → "Voiture électrique"
   */
  function tVehicle(type) {
    return messages.value.vehicles?.[type] ?? type;
  }

  /** BCP-47 locale tag for Intl APIs */
  const intlLocale = computed(() => (locale.value === "fr" ? "fr-FR" : "en-GB"));

  return { locale, messages, t, tp, tVehicle, intlLocale, setLocale, toggle };
});
