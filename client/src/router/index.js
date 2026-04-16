import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import AboutUsView from "../views/AboutUsView.vue";
import AuthView from "../views/AuthView.vue";
import ProfileView from "../views/ProfileView.vue";
import RidesView from "../views/RidesView.vue";

import { useAuthStore } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/about", name: "about", component: AboutUsView },
    { path: "/auth", name: "auth", component: AuthView },
    { path: "/profile", name: "profile", component: ProfileView, meta: { requiresAuth: true } },
    { path: "/rides", name: "rides", component: RidesView, meta: { requiresAuth: true } }
  ]
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth) {
    if (!auth.loaded && !auth.loading) {
      await auth.fetchMe();
    }
    if (!auth.user) return next("/auth");
    return next();
  }

  // If already logged in and trying to reach /auth, go to profile.
  if (to.name === "auth" && auth.user) return next("/profile");

  return next();
});

export default router;

