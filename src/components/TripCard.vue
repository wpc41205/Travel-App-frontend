<script setup>
import { computed } from "vue";

const props = defineProps({
  trip: {
    type: Object,
    required: true,
  },
});

const getHeroImage = (trip) => {
  const photos = trip?.photos;

  if (Array.isArray(photos) && photos.length > 0) {
    return photos[0];
  }

  if (typeof photos === "string" && photos.trim() !== "") {
    try {
      const parsed = JSON.parse(photos);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0];
      }
    } catch {
      if (photos.startsWith("http")) {
        return photos;
      }
    }
  }

  return null;
};

const formatCoordinate = (value) => {
  if (value === undefined || value === null || value === "") {
    return "-";
  }

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return value;
  }

  return numericValue.toFixed(3);
};

const formatPrice = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return value;
  }

  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(numericValue);
};

const heroImage = computed(() => getHeroImage(props.trip));
const formattedCoordinates = computed(() => ({
  latitude: formatCoordinate(props.trip.latitude),
  longitude: formatCoordinate(props.trip.longitude),
}));
const formattedPrice = computed(() => formatPrice(props.trip.price));

const additionalImages = computed(() => {
  const photos = props.trip?.photos;
  let list = [];

  if (Array.isArray(photos)) {
    list = photos;
  } else if (typeof photos === "string" && photos.trim() !== "") {
    try {
      const parsed = JSON.parse(photos);
      if (Array.isArray(parsed)) {
        list = parsed;
      }
    } catch {
      // ignore invalid json
    }
  }

  return list
    .filter((item) => item && item !== heroImage.value)
    .slice(0, 4);
});

const parseList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === "string" && item.trim() !== "");
  }
  if (typeof value === "string") {
    return value
      .split(/[,|]/)
      .map((item) => item.trim())
      .filter((item) => item !== "");
  }
  return [];
};

const tagList = computed(() => {
  const sources = [props.trip.tags, props.trip.topics, props.trip.keywords];

  for (const source of sources) {
    const list = parseList(source);
    if (list.length > 0) {
      return list.slice(0, 6);
    }
  }

  return [];
});

const primaryLink = computed(() => props.trip.link || props.trip.url || null);
</script>

<template>
  <article
    class="group grid overflow-hidden rounded-3xl border border-slate-300/20 bg-white/95 shadow-[0_24px_48px_rgba(15,23,42,0.08)] transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(15,23,42,0.12)] md:grid-cols-[260px_1fr]"
  >
    <figure
      v-if="heroImage"
      class="relative m-0 overflow-hidden border-b border-slate-300/20 md:border-b-0 md:border-r md:border-slate-300/20"
    >
      <img
        :src="heroImage"
        :alt="`ภาพประกอบทริป ${trip.title}`"
        loading="lazy"
        class="h-[220px] w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105 md:h-full"
      />
    </figure>

    <div class="flex flex-col gap-5 px-7 py-6">
      <header class="flex flex-col gap-4">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="flex flex-col gap-2">
            <p
              v-if="trip.category"
              class="inline-flex items-center self-start rounded-full bg-blue-500/10 px-3.5 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.04em] text-blue-600"
            >
              {{ trip.category }}
            </p>
            <h3 class="text-xl font-semibold text-slate-900 sm:text-2xl">
              {{ trip.title }}
            </h3>
            <p v-if="trip.subtitle" class="text-sm font-medium text-sky-500">
              {{ trip.subtitle }}
            </p>
          </div>

          <a
            v-if="primaryLink"
            :href="primaryLink"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-600 transition hover:border-sky-300 hover:bg-sky-100"
          >
            <span class="sr-only">เปิดลิงก์</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M10 13a5 5 0 0 1 7 0l1 1a5 5 0 0 1-7 7l-1-1" />
              <path d="M14 11a5 5 0 0 1-7 0l-1-1a5 5 0 0 1 7-7l1 1" />
              <path d="M16 8 8 16" />
            </svg>
          </a>
        </div>

        <p v-if="trip.description" class="text-sm leading-relaxed text-slate-600">
          {{ trip.description }}
        </p>
      </header>

      <div
        v-if="additionalImages.length"
        class="flex flex-wrap gap-3"
      >
        <img
          v-for="(image, index) in additionalImages"
          :key="`${trip.title}-image-${index}`"
          :src="image"
          :alt="`ภาพเพิ่มเติมของทริป ${trip.title}`"
          loading="lazy"
          class="h-14 w-20 flex-none rounded-xl object-cover shadow-sm ring-1 ring-slate-200/50"
        />
      </div>

      <div
        v-if="tagList.length"
        class="flex flex-wrap gap-2"
      >
        <span
          v-for="(tag, index) in tagList"
          :key="`${trip.title}-tag-${index}`"
          class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
        >
          {{ tag }}
        </span>
      </div>

      <dl
        class="grid gap-4 text-sm sm:grid-cols-[repeat(auto-fit,minmax(160px,1fr))]"
      >
        <div class="flex flex-col gap-1">
          <dt class="text-xs uppercase tracking-[0.08em] text-slate-400">
            พิกัด
          </dt>
          <dd class="font-semibold text-slate-800">
            {{ formattedCoordinates.latitude }}, {{ formattedCoordinates.longitude }}
          </dd>
        </div>

        <div v-if="trip.duration" class="flex flex-col gap-1">
          <dt class="text-xs uppercase tracking-[0.08em] text-slate-400">
            ระยะเวลา
          </dt>
          <dd class="font-semibold text-slate-800">{{ trip.duration }}</dd>
        </div>

        <div v-if="formattedPrice" class="flex flex-col gap-1">
          <dt class="text-xs uppercase tracking-[0.08em] text-slate-400">
            ราคาเริ่มต้น
          </dt>
          <dd class="font-semibold text-slate-800">{{ formattedPrice }}</dd>
        </div>

        <div v-if="trip.location" class="flex flex-col gap-1">
          <dt class="text-xs uppercase tracking-[0.08em] text-slate-400">
            สถานที่
          </dt>
          <dd class="font-semibold text-slate-800">{{ trip.location }}</dd>
        </div>
      </dl>

      <footer class="mt-auto flex">
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(59,130,246,0.28)] transition-all duration-150 ease-out focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-sky-400 focus-visible:ring-offset-white bg-[linear-gradient(120deg,#3b82f6_0%,#60a5fa_50%,#38bdf8_100%)] hover:-translate-y-0.5 hover:shadow-[0_20px_36px_rgba(59,130,246,0.32)]"
        >
          ดูรายละเอียด
        </button>
      </footer>
    </div>
  </article>
</template>

