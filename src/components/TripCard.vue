<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import type { Trip } from "../api";
import { getTripIdentifier } from "../utils/tripIdentifier";

type Nullable<T> = T | null | undefined;

const props = defineProps<{
  trip: Trip;
}>();

const emit = defineEmits<{
  (event: "tagClick", tag: string): void;
}>();

const router = useRouter();

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

const normalizeWhitespace = (text: string): string =>
  text
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/\\n/g, " ")
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const truncateCharacters = (
  text: Nullable<string>,
  charLimit: number
): string | null => {
  if (!text || typeof text !== "string") return text ?? null;

  const trimmed = normalizeWhitespace(text);
  if (trimmed.length <= charLimit) {
    return trimmed;
  }

  return `${trimmed.slice(0, charLimit)}…`;
};

const subtitleText = computed<string | null>(() => {
  const subtitle = props.trip.subtitle;
  if (typeof subtitle !== "string") {
    return null;
  }

  return (
    subtitle
      .replace(/[\r\n]+/g, " ")
      .replace(/\s+/g, " ")
      .trim() || null
  );
});

const truncatedDescription = computed<string | null>(() =>
  truncateCharacters(props.trip.description, 200)
);

const handleTagClick = (tag: string) => {
  emit("tagClick", tag);
};

const additionalImages = computed<string[]>(() => {
  const photos = props.trip?.photos;
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

  return list
    .filter((item) => item && item !== heroImage.value)
    .slice(0, 4);
});

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

const primaryLink = computed<string | null>(
  () => props.trip.link || props.trip.url || null
);

const tripIdentifier = computed(() => getTripIdentifier(props.trip));

const detailButtonClasses = computed(() => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white transition-all duration-150 ease-out focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-sky-400 focus-visible:ring-offset-white";

  if (tripIdentifier.value) {
    return `${baseClasses} shadow-[0_16px_30px_rgba(59,130,246,0.28)] bg-[linear-gradient(120deg,#3b82f6_0%,#60a5fa_50%,#38bdf8_100%)] hover:-translate-y-0.5 hover:shadow-[0_20px_36px_rgba(59,130,246,0.32)]`;
  }

  return `${baseClasses} bg-slate-400/70 cursor-not-allowed opacity-70`;
});

const goToDetail = () => {
  if (!tripIdentifier.value) return;

  router.push({
    name: "trip-detail",
    params: { tripId: tripIdentifier.value },
  });
};
</script>

<template>
  <div class="group flex flex-col gap-3 md:flex-row md:items-stretch md:gap-2">
    <div
      v-if="heroImage"
      class="relative mx-auto aspect-4/3 w-full max-w-[360px] flex-none overflow-hidden rounded-3xl border border-slate-300/20 bg-white/95 shadow-[0_24px_48px_rgba(15,23,42,0.08)] transition-all duration-200 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_30px_60px_rgba(15,23,42,0.12)] md:mx-0 md:max-w-[420px]"
    >
      <img
        :src="heroImage"
        :alt="`ภาพประกอบทริป ${trip.title}`"
        loading="lazy"
        class="block h-full w-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105"
      />
    </div>

    <article
      class="mx-auto flex w-full max-w-[540px] flex-col gap-2 rounded-3xl border border-slate-300/20 bg-white/95 px-7 py-6 shadow-[0_24px_48px_rgba(15,23,42,0.08)] transition-all duration-200 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_30px_60px_rgba(15,23,42,0.12)] md:mx-0 md:flex-1 md:max-w-none"
    >
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
            <p v-if="subtitleText" class="text-sm font-medium text-sky-500">
              {{ subtitleText }}
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

        <p v-if="truncatedDescription" class="text-sm leading-relaxed text-slate-600">
          {{ truncatedDescription }}
        </p>
      </header>

      <div
        v-if="tagList.length"
        class="flex flex-wrap gap-2"
      >
        <button
          type="button"
          v-for="(tag, index) in tagList"
          :key="`${trip.title}-tag-${index}`"
          class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          @click="handleTagClick(tag)"
        >
          {{ tag }}
        </button>
      </div>

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
          class="h-20 w-30 flex-none rounded-xl object-cover shadow-sm ring-1 ring-slate-200/50"
        />
      </div>

      <div class="mt-auto flex justify-end">
        <button
          type="button"
          :class="detailButtonClasses"
          :disabled="!tripIdentifier"
          @click="goToDetail"
        >
          ดูรายละเอียด
        </button>
      </div>
    </article>
  </div>
</template>

