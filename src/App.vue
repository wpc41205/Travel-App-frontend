<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
</script>

<template>
  <main
    class="min-h-screen bg-white px-4 pt-10 pb-12 sm:px-6 sm:pt-14 sm:pb-16 flex flex-col gap-10 sm:gap-12"
  >
    <NavBar />
    <RouterView class="flex flex-1" />
  </main>
</template>