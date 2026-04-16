<template>
  <div class="app-shell">
    <NavBar />
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
</script>
