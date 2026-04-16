import { defineStore } from "pinia";
import api from "../services/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    loaded: false,
    loading: false,
    error: null
  }),
  actions: {
    setUser(user) {
      this.user = user;
      this.loaded = true;
      this.error = null;
    },
    async fetchMe() {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get("/me");
        this.user = res.data.user || null;
        this.loaded = true;
        return this.user;
      } catch (err) {
        this.user = null;
        this.loaded = true;
        // 401 just means unauthenticated.
        return null;
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      try {
        await api.post("/auth/logout");
      } catch {
        // ignore — clear local state regardless
      }
      this.user = null;
      this.loaded = true;
    }
  }
});

