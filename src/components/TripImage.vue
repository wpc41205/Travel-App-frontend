<script setup lang="ts">
import { computed } from "vue";
import type { Trip } from "../api";

const props = defineProps<{
  trip: Trip;
}>();

const getHeroImage = (trip: Trip): string | null => {
  const photos = trip?.photos;

  if (Array.isArray(photos) && photos.length > 0) {
    const first = (photos as unknown[]).find(
      (item): item is string => typeof item === "string" && item.trim() !== ""
    );
    if (first) {
      return first;
    }
  }

  if (typeof photos === "string" && photos.trim() !== "") {
    try {
      const parsed = JSON.parse(photos) as unknown;
      if (Array.isArray(parsed) && parsed.length > 0) {
        const first = parsed.find(
          (item): item is string => typeof item === "string" && item.trim() !== ""
        );
        if (first) {
          return first;
        }
      }
    } catch {
      if (photos.startsWith("http")) {
        return photos;
      }
    }
  }

  return null;
};

const heroImage = computed<string | null>(() => getHeroImage(props.trip));
</script>

<template>
  <div
    v-if="heroImage"
    class="relative aspect-video w-full overflow-hidden shadow-lg"
  >
    <img
      :src="heroImage"
      :alt="`Trip illustration for ${trip.title}`"
      loading="lazy"
      class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
  </div>
</template>

