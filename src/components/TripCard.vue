<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import type { Trip } from "../api";
import { getTripIdentifier } from "../utils/tripIdentifier";
import TripImage from "./TripImage.vue";

type Nullable<T> = T | null | undefined;

const props = defineProps<{
  trip: Trip;
}>();

const emit = defineEmits<{
  (event: "tagClick", tag: string): void;
}>();

const router = useRouter();

const handleTagClick = (tag: string) => {
  emit("tagClick", tag);
};

const parseList = (value: Nullable<string | string[]>): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .filter((item) => item.trim() !== "");
  }
  if (typeof value === "string") {
    return value
      .split(/[,|]/)
      .map((item) => item.trim())
      .filter((item) => item !== "");
  }
  return [];
};

const tagList = computed<string[]>(() => {
  const sources = [props.trip.tags, props.trip.topics, props.trip.keywords];

  for (const source of sources) {
    const list = parseList(source);
    if (list.length > 0) {
      return list.slice(0, 6);
    }
  }

  return [];
});

const tripIdentifier = computed(() => getTripIdentifier(props.trip));

const goToDetail = () => {
  if (!tripIdentifier.value) return;

  router.push({
    name: "trip-detail",
    params: { tripId: tripIdentifier.value },
  });
};
</script>

<template>
  <div class="group flex flex-col">
    <div class="w-full">
      <TripImage :trip="trip" />
    </div>

    <article class="flex flex-1 flex-col mt-4 text-start">
      <div
        v-if="trip.category || trip.location"
        class="text-sm font-medium uppercase tracking-wider text-slate-500 mb-2"
      >
        <span v-if="trip.category">{{ trip.category }}</span>
        <span v-if="trip.category && trip.location"> \ </span>
        <span v-if="trip.location">{{ trip.location }}</span>
      </div>

      <!-- Title -->
      <h3 class="text-2xl leading-tight text-slate-900 transition-colors group-hover:text-blue-600 sm:text-3xl mb-4">
        {{ trip.title }}
      </h3>

      <!-- Tags -->
      <div
        v-if="tagList.length "
        class="flex flex-wrap gap-2"
      >
        <button
          type="button"
          v-for="(tag, index) in tagList"
          :key="`${trip.title}-tag-${index}`"
          class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-blue-100 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
          @click="handleTagClick(tag)"
        >
          {{ tag }}
        </button>
      </div>

      <!-- Read More Button -->
      <div class="mt-auto pt-4">
        <button
          type="button"
          class="inline-flex items-center gap-4 text-base font-medium text-slate-700 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!tripIdentifier"
          @click="goToDetail"
        >
          <span>Continue reading</span>
          <div class="flex h-7 w-7 items-center justify-center rounded-full border border-amber-200 bg-white transition-transform duration-200 group-hover:translate-x-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-5 w-5 text-slate-700"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </button>
      </div>
    </article>
  </div>
</template>

