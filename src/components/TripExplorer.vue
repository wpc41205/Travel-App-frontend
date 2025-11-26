<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import LoadingState from "./LoadingState.vue";
import EmptyState from "./EmptyState.vue";
import TripList from "./TripList.vue";
import { getTrips, type Trip } from "../api";

const trips = ref<Trip[]>([]);
const isLoading = ref(true);
const searchQuery = ref("");

const normalizedStringsFromTrip = (trip: Trip): string[] => {
  const fields = [
    trip.title,
    trip.subtitle,
    trip.description,
    trip.category,
    trip.location,
    ...(Array.isArray(trip.tags) ? trip.tags : []),
    ...(Array.isArray(trip.topics) ? trip.topics : []),
    ...(Array.isArray(trip.keywords) ? trip.keywords : []),
  ];

  return fields
    .flatMap((value) => {
      if (!value) return [];
      if (Array.isArray(value)) {
        return value;
      }
      return [value];
    })
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.toLowerCase());
};

onMounted(async () => {
  const data = await getTrips();
  trips.value = Array.isArray(data) ? data : [];
  isLoading.value = false;
});

const hasBaseTrips = computed(() => trips.value.length > 0);

const filteredTrips = computed(() => {
  const term = searchQuery.value.trim().toLowerCase();

  if (!term) {
    return trips.value;
  }

  return trips.value.filter((trip) =>
    normalizedStringsFromTrip(trip).some((value) => value.includes(term))
  );
});

const hasFilteredTrips = computed(() => filteredTrips.value.length > 0);
const showSearchNoResults = computed(
  () => searchQuery.value.trim() !== "" && hasBaseTrips.value && !hasFilteredTrips.value
);
</script>

<template>
  <div class="flex w-full flex-1 items-center justify-center">
    <LoadingState v-if="isLoading" />

    <div
      v-else
      class="flex w-full flex-col items-center gap-6"
    >
      <div class="flex w-[75%] flex-row items-center justify-between">
        <h2 v-if="!searchQuery.trim()" class="text-left text-3xl font-bold text-slate-900 sm:text-4xl">Latest Travel Guides</h2>
        <label for="trip-search" class="sr-only">Search trips</label>
        <div class="relative">
          <svg class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input id="trip-search" v-model="searchQuery" type="search" placeholder="Search for trips" class="w-64 border border-slate-200 bg-white/90 pl-10 pr-5 py-3 text-sm text-slate-700 shadow-[0_20px_40px_rgba(15,23,42,0.06)] outline-none transition focus:border-sky-300 focus:ring-1 focus:ring-sky-200" />
        </div>
      </div>

      <template v-if="hasBaseTrips">
        <p
          v-if="showSearchNoResults"
          class="rounded-2xl border border-slate-200 bg-white/80 px-5 py-6 text-center text-sm text-slate-500"
        >
          No trips match your search
          <strong class="font-semibold text-slate-600">“{{ searchQuery }}”</strong>
        </p>

        <div v-else class="flex w-full flex-col items-center gap-6">
          <TripList :trips="filteredTrips" />
        </div>
      </template>

      <EmptyState v-else />
    </div>
  </div>
</template>

