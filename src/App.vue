<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
</script>

<template>
  <main
    class="min-h-screen bg-no-repeat px-4 pt-10 pb-12 sm:px-6 sm:pt-14 sm:pb-16 flex flex-col gap-10 sm:gap-12 bg-[radial-gradient(circle_at_-5%_-10%,rgba(119,192,255,0.45),transparent_48%),radial-gradient(circle_at_110%_0%,rgba(255,184,140,0.45),transparent_50%),linear-gradient(180deg,#f2f7ff_0%,#fdfdfd_100%)]"
  >
    <NavBar />
    <RouterView class="flex flex-1" />
  </main>
</template>