import { createApp } from "vue";
import { createPinia } from "pinia";

import "./styles/theme.css";

import App from "./App.vue";
import router from "./router/index.js";
import { useThemeStore } from "./stores/theme.js";
import { useI18nStore } from "./stores/i18n.js";

const pinia = createPinia();
const app = createApp(App).use(pinia).use(router);

// Boot singleton stores before first render.
useThemeStore();
useI18nStore();

app.mount("#app");

