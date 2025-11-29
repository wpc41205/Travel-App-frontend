<script setup lang="ts">
import { computed } from "vue";
import type { Trip } from "../api";
import { getFirstImageUrl } from "../utils/imageUrl";

const props = defineProps<{
  trip: Trip;
}>();

const heroImage = computed<string | null>(() => {
  const url = getFirstImageUrl(props.trip?.photos);
  console.log("[TripImage] Computed heroImage:", url, "for trip:", props.trip?.title);
  return url;
});

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  console.error("[TripImage] Failed to load image:", img.src);
  // Hide broken image
  img.style.display = "none";
}

function handleImageLoad(event: Event) {
  console.log("[TripImage] Image loaded successfully:", (event.target as HTMLImageElement).src);
}
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
      @error="handleImageError"
      @load="handleImageLoad"
    />
  </div>
  <div
    v-else
    class="relative aspect-video w-full overflow-hidden bg-slate-100 shadow-lg flex items-center justify-center"
  >
    <p class="text-slate-400 text-sm">No image available</p>
  </div>
</template>

