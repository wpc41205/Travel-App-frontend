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

const fetchTrip = async () => {
  if (!tripParam.value) {
    errorMessage.value = "ไม่พบรหัสทริป";
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
      errorMessage.value = "ไม่พบทริปที่คุณต้องการ";
    }
  } catch (error) {
    console.error(error);
    errorMessage.value = "เกิดข้อผิดพลาดในการโหลดข้อมูลทริป";
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
  <div class="mx-auto w-full max-w-5xl px-5 py-10 lg:px-0">

    <div
      v-if="isLoading"
      class="rounded-3xl border border-slate-200 bg-white/60 p-10 text-center text-slate-500"
    >
      กำลังโหลดข้อมูลทริป...
    </div>

    <div
      v-else-if="errorMessage"
      class="rounded-3xl border border-red-100 bg-red-50/60 p-10 text-center text-red-600"
    >
      <p class="mb-4 font-semibold">{{ errorMessage }}</p>
      <router-link
        to="/"
        class="inline-flex items-center justify-center rounded-full border border-sky-200 px-4 py-2 text-sm font-semibold text-sky-600 transition hover:bg-sky-50"
      >
        เลือกทริปอื่น
      </router-link>
    </div>

    <article
      v-else-if="trip"
      class="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)]"
    >
      <router-link
        to="/"
        class="inline-flex items-center text-sm font-semibold text-sky-600 hover:text-sky-700"
      >
        ← กลับหน้าหลัก
      </router-link>

      <div
        v-if="heroImage"
        class="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50/60"
      >
        <img
          :src="heroImage"
          :alt="`ภาพประกอบทริป ${trip.title}`"
          class="block h-full w-full max-h-[320px] object-cover"
          loading="lazy"
        />
      </div>

      <header class="flex flex-col gap-2">
        <p
          v-if="trip.category"
          class="inline-flex items-center self-start rounded-full bg-blue-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.04em] text-blue-600"
        >
          {{ trip.category }}
        </p>
        <div>
          <h1 class="text-3xl font-semibold text-slate-900">
            {{ trip.title }}
          </h1>
          <p v-if="subtitleText" class="mt-2 text-base font-medium text-sky-500">
            {{ subtitleText }}
          </p>
        </div>
        <div class="flex flex-wrap gap-3 text-sm text-slate-500">
          <span v-if="trip.location">📍 {{ trip.location }}</span>
          <span v-if="trip.duration">🕒 {{ trip.duration }}</span>
          <span v-if="trip.price">💰 {{ trip.price }}</span>
        </div>
      </header>

      <section v-if="fullDescription" class="prose max-w-none text-slate-700">
        <p>{{ fullDescription }}</p>
      </section>

      <section v-if="additionalImages.length" class="flex flex-wrap gap-3">
        <img
          v-for="(image, index) in additionalImages"
          :key="`detail-image-${index}`"
          :src="image"
          :alt="`ภาพเพิ่มเติมของทริป ${trip.title}`"
          class="h-24 w-32 rounded-2xl object-cover shadow-sm ring-1 ring-slate-200/70"
          loading="lazy"
        />
      </section>

      <section v-if="tagList.length" class="flex flex-wrap gap-2">
        <span class="text-sm font-semibold text-slate-500">แท็กที่เกี่ยวข้อง:</span>
        <span
          v-for="(tag, index) in tagList"
          :key="`tag-${index}`"
          class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
        >
          {{ tag }}
        </span>
      </section>

      <section class="flex flex-wrap gap-3">
        <a
          v-if="mapLink"
          :href="mapLink"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:border-emerald-300 hover:bg-emerald-100"
        >
          เปิดแผนที่
        </a>
        <a
          v-if="primaryLink"
          :href="primaryLink"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-600 transition hover:border-sky-300 hover:bg-sky-100"
        >
          เปิดลิงก์เพิ่มเติม
        </a>
      </section>
    </article>
  </div>
</template>

