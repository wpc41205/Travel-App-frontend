<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { getTrips, type Trip } from "../api";
import { matchesTripIdentifier } from "../utils/tripIdentifier";

type Nullable<T> = T | null | undefined;

const route = useRoute();

const trip = ref<Trip | null>(null);
const isLoading = ref(true);
const errorMessage = ref<string | null>(null);

const tripParam = computed(() => route.params.tripId as string);

const normalizeWhitespace = (text: string): string =>
  text
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/\\n/g, " ")
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getHeroImage = (currentTrip: Trip): string | null => {
  const photos = currentTrip?.photos;

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

const heroImage = computed<string | null>(() =>
  trip.value ? getHeroImage(trip.value) : null
);

const additionalImages = computed<string[]>(() => {
  if (!trip.value) return [];

  const photos = trip.value.photos;
  let list: string[] = [];

  if (Array.isArray(photos)) {
    list = photos.filter((item): item is string => typeof item === "string");
  } else if (typeof photos === "string" && photos.trim() !== "") {
    try {
      const parsed = JSON.parse(photos) as unknown;
      if (Array.isArray(parsed)) {
        list = parsed.filter((item): item is string => typeof item === "string");
      }
    } catch {
      // ignore invalid json
    }
  }

  return list.filter(Boolean);
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
    } else {
      errorMessage.value = "We couldn’t find the trip you’re looking for.";
    }
  } catch (error) {
    console.error(error);
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
        class="group relative mx-auto max-w-3xl overflow-hidden bg-slate-100 ring-1 ring-slate-200/70"
      >
        <img
          :src="heroImage"
          :alt="`Trip illustration for ${trip.title}`"
          class="block aspect-video w-full max-h-[320px] object-cover transition duration-700 group-hover:scale-[1.03]"
          loading="lazy"
        />
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
          class="overflow-hidden bg-slate-100 shadow-sm ring-1 ring-slate-200/70"
        >
          <img
            :src="image"
            :alt="`Additional photo of ${trip.title}`"
            class="block aspect-4/3 w-full max-h-48 object-cover transition duration-500 hover:scale-105"
            loading="lazy"
          />
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

