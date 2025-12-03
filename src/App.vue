<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <main
    class="min-h-screen bg-white px-4 pt-8 pb-10 sm:px-6 sm:pt-12 sm:pb-14 md:px-8 md:pt-14 md:pb-16 flex flex-col gap-8 sm:gap-10 md:gap-12"
  >
    <NavBar />
    <RouterView class="flex flex-1" />
    <Footer />
  </main>
</template>