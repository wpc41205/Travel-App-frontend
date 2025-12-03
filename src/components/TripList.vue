<script setup lang="ts">
import { computed, ref, watch } from "vue";
import TripCard from "./TripCard.vue";
import type { Trip } from "../api";

const props = defineProps<{
  trips: Trip[];
}>();

const selectedTags = ref<string[]>([]);
const currentPage = ref(1);
const tripsPerPage = 9;

// Make sure tag cleaning/normalization matches TripCard.vue
const cleanTag = (tag: string): string => {
  return tag
    .replace(/[\[\]"'(){}]/g, "") // Remove brackets, quotes, parentheses, braces
    .trim();
};

const normalizeTag = (tag: string) => cleanTag(tag).toLowerCase();

const parseList = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => cleanTag(item))
      .filter((item) => item !== "");
  }
  if (typeof value === "string") {
    return value
      .split(/[,|]/)
      .map((item) => cleanTag(item))
      .filter((item) => item !== "");
  }
  return [];
};

const tripMatchesTag = (trip: Trip, tag: string): boolean => {
  const sources = [trip.tags, trip.topics, trip.keywords, trip.category];
  const target = normalizeTag(tag);

  return sources.some((source) =>
    parseList(source).some((item) => normalizeTag(item) === target)
  );
};

const filteredTrips = computed(() => {
  if (selectedTags.value.length === 0) {
    return props.trips;
  }

  return props.trips.filter((trip) =>
    selectedTags.value.every((tag) => tripMatchesTag(trip, tag))
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredTrips.value.length / tripsPerPage);
});

const paginatedTrips = computed(() => {
  const start = (currentPage.value - 1) * tripsPerPage;
  const end = start + tripsPerPage;
  return filteredTrips.value.slice(start, end);
});

const handleTagFilter = (tag: string) => {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter((item) => item !== tag);
  } else {
    selectedTags.value = [...selectedTags.value, tag];
  }
  // Reset to first page when filter changes
  currentPage.value = 1;
};

const clearFilter = () => {
  selectedTags.value = [];
  currentPage.value = 1;
};

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    scrollToTop();
  }
};

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    scrollToTop();
  }
};

const scrollToTop = () => {
  const tripsElement = document.getElementById("trips");
  if (tripsElement) {
    tripsElement.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

// Reset to first page when filtered trips change
watch(filteredTrips, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = 1;
  }
});
</script>

<template>
  <div
    id="trips"
    class="mx-auto flex w-full flex-col gap-6 sm:gap-7"
  >
    <div
      v-if="selectedTags.length"
      class="flex flex-col gap-3 rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-sm text-sky-700 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5"
    >
      <div class="flex flex-wrap items-center gap-2">
        <span class="font-medium">Filtering by tags:</span>
        <ul class="flex flex-wrap items-center gap-2">
          <li
            v-for="tag in selectedTags"
            :key="tag"
            class="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-semibold text-sky-800 shadow-sm transition hover:border-sky-300"
          >
            {{ tag }}
            <button
              type="button"
              class="inline-flex h-4 w-4 items-center justify-center rounded-full text-sky-600 transition hover:text-sky-800"
              aria-label="Remove tag"
              @click="handleTagFilter(tag)"
            >
              &times;
            </button>
          </li>
        </ul>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-semibold text-sky-600 transition hover:border-sky-300 hover:bg-sky-50"
        @click="clearFilter"
      >
        Clear filters
      </button>
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-7">
      <TripCard
        v-for="trip in paginatedTrips"
        :key="trip.id ?? trip.title ?? JSON.stringify(trip)"
        :trip="trip"
        @tag-click="handleTagFilter"
      />
    </div>

    <p
      v-if="filteredTrips.length === 0"
      class="rounded-2xl border border-slate-200 bg-white/80 px-5 py-6 text-center text-sm text-slate-500 shadow-sm"
    >
      <template v-if="selectedTags.length">
        No trips match the tags
        <strong class="font-semibold text-slate-600">{{ selectedTags.join(", ") }}</strong>
      </template>
      <template v-else>
        No trips available
      </template>
    </p>

    <!-- Pagination Controls -->
    <div
      v-if="filteredTrips.length > tripsPerPage"
      class="flex flex-row flex-wrap items-center justify-center gap-3 pt-4 sm:gap-4"
    >
      <button
        type="button"
        :disabled="currentPage === 1"
        class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
        @click="goToPreviousPage"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-4 w-4"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span class="hidden sm:inline">Previous</span>
      </button>

      <div class="flex items-center gap-2 text-sm text-slate-600">
        <span>Page</span>
        <span class="font-semibold text-slate-900">{{ currentPage }}</span>
        <span>of</span>
        <span class="font-semibold text-slate-900">{{ totalPages }}</span>
      </div>

      <button
        type="button"
        :disabled="currentPage === totalPages"
        class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
        @click="goToNextPage"
      >
        <span class="hidden sm:inline">Next</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-4 w-4"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  </div>
</template>

