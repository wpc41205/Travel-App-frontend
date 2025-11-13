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
      <div class="relative w-full max-w-[800px]">
        <label for="trip-search" class="sr-only">ค้นหาทริป</label>
        <input
          id="trip-search"
          v-model="searchQuery"
          type="search"
          placeholder="ค้นหาทริปตามชื่อ หมวดหมู่ หรือแท็ก..."
          class="w-full rounded-xl border border-slate-200 bg-white/90 px-5 py-3 text-sm text-slate-700 shadow-[0_20px_40px_rgba(15,23,42,0.06)] outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-200 focus:ring-offset-2 focus:ring-offset-white"
        />
      </div>

      <template v-if="hasBaseTrips">
        <p
          v-if="showSearchNoResults"
          class="rounded-2xl border border-slate-200 bg-white/80 px-5 py-6 text-center text-sm text-slate-500"
        >
          ไม่พบทริปที่ตรงกับคำค้น
          <strong class="font-semibold text-slate-600">“{{ searchQuery }}”</strong>
        </p>

        <TripList
          v-else
          :trips="filteredTrips"
        />
      </template>

      <EmptyState v-else />
    </div>
  </div>
</template>

