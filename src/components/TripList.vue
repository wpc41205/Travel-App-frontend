<script setup lang="ts">
import { computed, ref } from "vue";
import TripCard from "./TripCard.vue";
import type { Trip } from "../api";

const props = defineProps<{
  trips: Trip[];
}>();

const selectedTags = ref<string[]>([]);

const normalizeTag = (tag: string) => tag.trim().toLowerCase();

const parseList = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter((item) => item !== "");
  }
  if (typeof value === "string") {
    return value
      .split(/[,|]/)
      .map((item) => item.trim())
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

const handleTagFilter = (tag: string) => {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter((item) => item !== tag);
  } else {
    selectedTags.value = [...selectedTags.value, tag];
  }
};

const clearFilter = () => {
  selectedTags.value = [];
};
</script>

<template>
  <div
    id="trips"
    class="mx-auto flex w-full max-w-5xl flex-col gap-6 sm:gap-7"
  >
    <div
      v-if="selectedTags.length"
      class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-sky-100 bg-sky-50/60 px-5 py-3 text-sm text-sky-700"
    >
      <div class="flex flex-wrap items-center gap-2">
        <span>กำลังกรองด้วยแท็ก</span>
        <ul class="flex flex-wrap items-center gap-2">
          <li
            v-for="tag in selectedTags"
            :key="tag"
            class="inline-flex items-center gap-1 rounded-full border border-sky-200 px-3 py-1 text-xs font-semibold text-sky-800"
          >
            {{ tag }}
            <button
              type="button"
              class="inline-flex h-4 w-4 items-center justify-center rounded-full text-black"
              aria-label="ลบแท็ก"
              @click="handleTagFilter(tag)"
            >
              &times;
            </button>
          </li>
        </ul>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-1 rounded-full border border-sky-200 px-3 py-1 text-xs font-semibold text-sky-600 transition hover:border-sky-300 hover:bg-white/80"
        @click="clearFilter"
      >
        ล้างตัวกรอง
      </button>
    </div>

    <TripCard
      v-for="trip in filteredTrips"
      :key="trip.id ?? trip.title ?? JSON.stringify(trip)"
      :trip="trip"
      @tag-click="handleTagFilter"
    />

    <p
      v-if="filteredTrips.length === 0"
      class="rounded-2xl border border-slate-200 bg-white/80 px-5 py-6 text-center text-sm text-slate-500"
    >
      <template v-if="selectedTags.length">
        ไม่พบทริปที่ตรงกับแท็ก
        <strong class="font-semibold text-slate-600">{{ selectedTags.join(", ") }}</strong>
      </template>
      <template v-else>
        ไม่พบข้อมูลทริป
      </template>
    </p>
  </div>
</template>

