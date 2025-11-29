<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { getTrips, type Trip } from "../api";
import { matchesTripIdentifier } from "../utils/tripIdentifier";
import { getFirstImageUrl, getAllImageUrls } from "../utils/imageUrl";

type Nullable<T> = T | null | undefined;

const route = useRoute();

const trip = ref<Trip | null>(null);
const isLoading = ref(true);
const errorMessage = ref<string | null>(null);
const imageErrors = ref<Record<string, boolean>>({});

const handleImageError = (url: string, element: HTMLImageElement) => {
  // Mark as error and show placeholder - no need for extra fetch requests
  imageErrors.value[url] = true;
  element.style.opacity = '0';
  element.style.position = 'absolute';
};

const handleImageLoad = (url: string) => {
  imageErrors.value[url] = false;
};

const tripParam = computed(() => route.params.tripId as string);

const normalizeWhitespace = (text: string): string =>
  text
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/\\n/g, " ")
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const heroImage = computed<string | null>(() => {
  if (!trip.value) return null;
  return getFirstImageUrl(trip.value.photos);
});

const additionalImages = computed<string[]>(() => {
  if (!trip.value) return [];
  const allImages = getAllImageUrls(trip.value.photos);
  // Skip the first image as it's shown as hero image
  return allImages.slice(1);
});

const parseList = (value: Nullable<string | string[]>): string[] => {
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

const tagList = computed<string[]>(() => {
  if (!trip.value) return [];

  const sources = [trip.value.tags, trip.value.topics, trip.value.keywords];
  const tags = new Set<string>();

  sources.forEach((source) => {
    parseList(source).forEach((item) => tags.add(item));
  });

  return Array.from(tags);
});

const primaryLink = computed<string | null>(() => {
  if (!trip.value) return null;
  return trip.value.link || trip.value.url || null;
});

const mapLink = computed<string | null>(() => {
  if (!trip.value) return null;
  if (trip.value.latitude && trip.value.longitude) {
    return `https://www.google.com/maps?q=${trip.value.latitude},${trip.value.longitude}`;
  }
  return null;
});


const subtitleText = computed<string | null>(() => {
  if (!trip.value?.subtitle || typeof trip.value.subtitle !== "string") {
    return null;
  }
  return (
    trip.value.subtitle
      .replace(/[\r\n]+/g, " ")
      .replace(/\s+/g, " ")
      .trim() || null
  );
});

const fullDescription = computed<string | null>(() => {
  if (!trip.value?.description || typeof trip.value.description !== "string") {
    return null;
  }
  return normalizeWhitespace(trip.value.description);
});

const descriptionParagraphs = computed<string[]>(() => {
  if (!fullDescription.value) return [];
  return fullDescription.value
    .split(/(?:\n{2,}|\.{2,})/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
});

const fetchTrip = async () => {
  if (!tripParam.value) {
    errorMessage.value = "Trip identifier not found.";
    return;
  }

  isLoading.value = true;
  errorMessage.value = null;

  try {
    const trips = await getTrips();
    const found = trips.find((item) => matchesTripIdentifier(item, tripParam.value));
    
    if (found) {
      trip.value = found;
      // Debug: Log photos data to see what we're working with
      console.log("[TripDetailPage] Trip photos data:", {
        photos: found.photos,
        type: typeof found.photos,
        isArray: Array.isArray(found.photos),
        firstImage: heroImage.value,
        allImages: additionalImages.value,
      });
    } else {
      errorMessage.value = "We couldn't find the trip you're looking for.";
    }
  } catch (error) {
    console.error("[TripDetailPage] Error fetching trip:", error);
    errorMessage.value = "Something went wrong while loading this trip.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchTrip);

watch(tripParam, () => {
  if (!trip.value || !matchesTripIdentifier(trip.value, tripParam.value)) {
    fetchTrip();
  }
});
</script>

<template>
  <div class="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-10 text-center">
    <div
      v-if="isLoading"
    >
      Loading trip details...
    </div>

    <div
      v-else-if="errorMessage"
      class="mx-auto max-w-2xl text-center"
    >
      <p class="mb-4 text-2xl font-semibold text-slate-900">{{ errorMessage }}</p>
      <router-link
        to="/"
        class="inline-flex items-center justify-center bg-white/80 px-5 py-2 text-sm font-semibold text-rose-600 shadow-sm ring-1 ring-rose-200 transition hover:bg-white"
      >
        Browse other trips
      </router-link>
    </div>

    <article
      v-else-if="trip"
      class="flex flex-col items-center gap-8"
    >
      <div class="flex flex-col items-center gap-3 text-center">
        <p
          v-if="trip.category"
          class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600"
        >
          {{ trip.category }}
        </p>
        <h1 class="text-3xl font-semibold text-slate-900 sm:text-4xl">
          {{ trip.title }}
        </h1>
        <p v-if="subtitleText" class="text-lg font-medium text-sky-500 max-w-2xl">
          {{ subtitleText }}
        </p>
      </div>

      <div
        v-if="heroImage"
        class="group relative mx-auto max-w-3xl overflow-hidden bg-slate-100 ring-1 ring-slate-200/70 aspect-video"
      >
        <img
          :src="heroImage"
          :alt="`Trip illustration for ${trip.title}`"
          class="block w-full h-full max-h-[320px] object-cover transition duration-700 group-hover:scale-[1.03]"
          loading="lazy"
          @error="(e) => { if (heroImage) handleImageError(heroImage, e.target as HTMLImageElement); }"
          @load="() => { if (heroImage) handleImageLoad(heroImage); }"
        />
        <div
          v-if="heroImage && imageErrors[heroImage]"
          class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300"
        >
          <div class="text-center px-4">
            <svg class="mx-auto h-12 w-12 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-slate-500 text-sm font-medium mb-1">ไม่สามารถโหลดรูปภาพ</p>
            <p class="text-slate-400 text-xs">ตรวจสอบการตั้งค่า Supabase Storage Bucket</p>
          </div>
        </div>
      </div>
      <div
        v-else
        class="group relative mx-auto max-w-3xl overflow-hidden bg-slate-100 ring-1 ring-slate-200/70 flex items-center justify-center aspect-video"
      >
        <p class="text-slate-400 text-sm">ไม่มีรูปภาพ</p>
      </div>

      <section
        v-if="descriptionParagraphs.length"
        class="w-full max-w-4xl text-lg leading-relaxed text-slate-700 text-left"
      >
        <p v-for="(paragraph, index) in descriptionParagraphs" :key="`paragraph-${index}`">
          {{ paragraph }}
        </p>
      </section>

      <section v-else-if="fullDescription" class="w-full max-w-3xl text-left text-lg leading-relaxed text-slate-700">
        <p>{{ fullDescription }}</p>
      </section>

      <section
        v-if="additionalImages.length"
        class="grid w-full max-w-4xl gap-4 sm:grid-cols-2 md:grid-cols-4"
      >
        <figure
          v-for="(image, index) in additionalImages"
          :key="`detail-image-${index}`"
          class="relative overflow-hidden bg-slate-100 shadow-sm ring-1 ring-slate-200/70 aspect-4/3"
        >
          <img
            :src="image"
            :alt="`Additional photo of ${trip.title}`"
            class="block w-full h-full max-h-48 object-cover transition duration-500 hover:scale-105"
            loading="lazy"
            @error="(e) => handleImageError(image, e.target as HTMLImageElement)"
            @load="() => handleImageLoad(image)"
          />
          <div
            v-if="imageErrors[image]"
            class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300"
          >
            <div class="text-center px-2">
              <svg class="mx-auto h-8 w-8 text-slate-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p class="text-slate-500 text-xs">ไม่สามารถโหลด</p>
            </div>
          </div>
        </figure>
      </section>

      <section
        v-if="tagList.length"
        class="flex w-full max-w-4xl flex-wrap gap-2 justify-start text-left"
      >
        <span class="text-sm font-semibold text-slate-500">Related tags:</span>
        <span
          v-for="(tag, index) in tagList"
          :key="`tag-${index}`"
          class="inline-flex items-center bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-slate-100"
        >
          {{ tag }}
        </span>
      </section>

      <section
        v-if="mapLink"
        class="w-full max-w-4xl space-y-5"
      >
        <iframe
          :src="`${mapLink}&output=embed`"
          width="100%"
          height="500"
          style="border:0"
          allowfullscreen
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          class="w-full"
        ></iframe>
        <a
          :href="mapLink"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center gap-2 bg-emerald-100 px-5 py-2 text-sm font-semibold text-emerald-700 shadow-sm ring-1 ring-emerald-200 transition hover:bg-emerald-200"
        >
          <span>🗺️</span>
          View on Google Maps
        </a>
        <a
          v-if="primaryLink"
          :href="primaryLink"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 bg-sky-100 px-5 py-2 text-sm font-semibold text-sky-700 shadow-sm ring-1 ring-sky-200 transition hover:bg-sky-200"
        >
          <span>🔗</span>
          View source link
        </a>
      </section>
    </article>
  </div>
</template>

