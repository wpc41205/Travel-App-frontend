<script setup lang="ts">
import TripCard from "./TripCard.vue";
import type { Trip } from "../api";

const props = defineProps<{
  trips: Trip[];
}>();
</script>

<template>
  <div
    id="trips"
    class="mx-auto flex w-full max-w-5xl flex-col gap-6 sm:gap-7"
  >
    <TripCard v-for="trip in props.trips" :key="trip.id ?? trip.title" :trip="trip" />
  </div>
</template>

