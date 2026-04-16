import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const STORAGE_KEY = "sr-theme";

  const isDark = ref(localStorage.getItem(STORAGE_KEY) !== "light");

  function apply() {
    document.documentElement.setAttribute("data-theme", isDark.value ? "dark" : "light");
  }

  function toggle() {
    isDark.value = !isDark.value;
  }

  watch(isDark, (val) => {
    localStorage.setItem(STORAGE_KEY, val ? "dark" : "light");
    apply();
  });

  // Apply on first load.
  apply();

  return { isDark, toggle };
});
